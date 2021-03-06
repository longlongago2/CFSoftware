import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Modal,
    TouchableNativeFeedback,
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    MenuContext,
    renderers,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/EvilIcons';
import ACTIONS from '../../models/actions';
import styleModule from './indexStyle';

const styles = StyleSheet.create(styleModule);

export default class WoTypeSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            menuVisible: false,
        };
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timer);
    }

    render() {
        const { woTypeItems, navigation, workOrderDetail, dispatch } = this.props;
        const { state, setParams } = navigation;
        const { modalVisible, menuVisible } = this.state;
        return (
            <View>
                <TouchableNativeFeedback
                    onPress={() =>
                        this.setState({ modalVisible: true, menuVisible: true })
                    }
                >
                    <View style={styles.contentOption}>
                        <View style={styles.contentLabel}>
                            <Text>工单类型<Text style={{ color: 'red' }}>
                                *</Text></Text>
                        </View>
                        <View style={styles.contentSelect}>
                            <View style={styles.selectTextLayout}>
                                <Text style={styles.selectText}>
                                    {
                                        (state.params && state.params.dataFilling) ?
                                            workOrderDetail.wstypename : (
                                                state.params &&
                                                state.params.woType &&
                                                state.params.woType.label
                                            )
                                    }
                                </Text>
                            </View>
                            <View style={styles.selectIconLayout}>
                                <Icon
                                    name="chevron-right"
                                    size={25}
                                    color="rgba(94, 94, 94, 0.5)"
                                />
                            </View>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <Modal
                    animationType="fade"
                    transparent
                    visible={modalVisible}
                    onRequestClose={() => this.setState({ menuVisible: false })}
                >
                    <MenuContext
                        style={{
                            flexDirection: 'column',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}
                    >
                        <Menu
                            renderer={renderers.SlideInMenu}
                            opened={menuVisible}
                            onBackdropPress={() => this.setState({ menuVisible: false })}
                            onClose={() => {
                                this.timer = requestAnimationFrame(() =>
                                    this.setState({ modalVisible: false }),
                                );
                            }}
                        >
                            <MenuTrigger />
                            <MenuOptions
                                renderOptionsContainer={options => (
                                    <View>
                                        <Text style={styles.selectOptionsTitle}>工单类型</Text>
                                        <ScrollView style={{ maxHeight: 200 }}>
                                            {options}
                                        </ScrollView>
                                    </View>
                                )}
                            >
                                {
                                    Array.isArray(woTypeItems) && woTypeItems.length > 0 &&
                                    woTypeItems.map(item => (
                                        <MenuOption
                                            key={`${item.codeid}`}
                                            onSelect={() => {
                                                if (state.params && state.params.dataFilling) {
                                                    dispatch({
                                                        type: ACTIONS.WORKORDER_DETAIL.UPDATE,
                                                        payload: {
                                                            workOrderDetail: {
                                                                wstypename: item.codeitemname,
                                                                wstype: item.codeid,
                                                            },
                                                        },
                                                    });
                                                } else {
                                                    setParams({
                                                        woType: {
                                                            label: item.codeitemname,
                                                            value: item.codeid,
                                                        },
                                                    });
                                                }
                                                this.setState({ menuVisible: false });
                                            }}
                                        >
                                            <Text
                                                numberOfLines={1}
                                                style={styles.selectOptionsText}
                                            >
                                                {item.codeitemname}
                                            </Text>
                                        </MenuOption>
                                    ))
                                }
                            </MenuOptions>
                        </Menu>
                    </MenuContext>
                </Modal>
            </View>
        );
    }
}

WoTypeSelect.propTypes = {
    woTypeItems: PropTypes.array.isRequired,
    navigation: PropTypes.object.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
};
