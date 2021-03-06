import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import styleModule from './indexStyle';
import ItemSeparator from '../../components/ItemSeparator';
import ListEmptyComponent from '../../components/ListEmptyComponent';
import ListFooterLoading from '../../components/ListFooterLoading';
import WorkorderListItem from './woListItem';
import ModalFilter from './modalFilter';
import ACTIONS from '../../models/actions';

const styles = StyleSheet.create(styleModule);

class WOGroup extends PureComponent {
    static scrollToTop() {
        WOGroup.flatList.scrollToOffset({
            animated: true,
            offset: 0,
        });
    }

    constructor(props) {
        super(props);
        this.state = {
            screenHeight: Dimensions.get('window').height, // 设备屏幕高度
            haveHeaderPrompt: false,
        };
        this.queryInitialData = this._queryInitialData.bind(this);
        this.queryPaginationData = this._queryPaginationData.bind(this);
        this.handleLayoutResize = this._handleLayoutResize.bind(this);
        this.clearState = this._clearState.bind(this);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        // 查询筛选条件数据
        dispatch({
            type: ACTIONS.WO_PRODUCT.REQUEST,
        });
        // 查询初始数据
        this.queryInitialData();
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerQueryPaginationData);
        cancelAnimationFrame(this.timerQueryInitialData);
        this.clearState();
        clearTimeout(this.timerScrollState);
    }

    _clearState() {
        const { dispatch } = this.props;
        // 清除 state 数据
        dispatch({
            type: ACTIONS.WORKORDER.INITIAL,
            payload: { stateName: 'woGroup' },
        });
    }

    _queryInitialData() {
        const { dispatch, navigation } = this.props;
        const { state } = navigation;
        // 使用timer异步可以可以解决refresh请求两次的问题
        this.timerQueryInitialData = requestAnimationFrame(() => {
            // 初始化
            this.clearState();
            // 查询（添加筛选条件）
            const filter = state.params && state.params.filter;
            dispatch({
                type: ACTIONS.WORKORDER.REQUEST,
                payload: {
                    stateName: 'woGroup',
                    stateValue: {
                        pageNumber: 0,
                        isDel: 0,
                        wStateClient: -2,
                        queryType: 2,
                        ...filter,
                    },
                },
            });
        });
    }

    _queryPaginationData() {
        const { dispatch, workorderList, navigation } = this.props;
        const { state } = navigation;
        if (workorderList.length > 0) {
            this.timerQueryPaginationData = requestAnimationFrame(() => {
                const filter = state.params && state.params.filter;
                dispatch({
                    type: ACTIONS.WORKORDER.REQUEST,
                    payload: {
                        stateName: 'woGroup',
                        stateValue: {
                            isDel: 0,
                            wStateClient: -2,
                            queryType: 2,
                            ...filter,
                        },
                    },
                });
            });
        }
    }

    _handleLayoutResize() {
        this.setState({
            screenHeight: Dimensions.get('window').height,
        });
    }

    render() {
        const {
            loading,
            workorderList,
            pageNumber,
            pageLoading,
            loaded,
            dispatch,
            navigation,
            userInfo,
            woProductItems,
        } = this.props;
        const { state, setParams } = navigation;
        const { screenHeight, haveHeaderPrompt } = this.state;
        return (
            <View style={styles.container} onLayout={this.handleLayoutResize}>
                <ModalFilter
                    navigation={navigation}
                    onSubmit={this.queryInitialData}
                    woProductItems={woProductItems}
                />
                <FlatList
                    ref={(_ref) => {
                        WOGroup.flatList = _ref;
                    }}
                    data={workorderList}
                    keyExtractor={(item, index) => item.ordercode}
                    refreshing={loading}
                    onRefresh={this.queryInitialData}
                    onEndReachedThreshold={0.1}
                    onEndReached={this.queryPaginationData}
                    initialNumToRender={10}
                    ItemSeparatorComponent={() => (
                        <ItemSeparator
                            backgroundColor="rgba(255,255,255,0.8)"
                            border={0.8}
                            lineColor="rgba(139,139,139,0.3)"
                            marginHorizontal={15}
                        />
                    )}
                    ListEmptyComponent={() => (
                        <ListEmptyComponent
                            text={loading ? '正在拼命加载...' : '没有工单数据...'}
                            icon={loading ? require('../../assets/loading.png') : require('../../assets/noData.png')}
                            customStyle={{
                                height: screenHeight - 150 > 85 ? screenHeight - 150 : 85,
                            }}
                        />
                    )}
                    ListFooterComponent={() => (
                        <ListFooterLoading
                            loading={pageLoading}
                            loaded={loaded}
                            visible={workorderList.length > 0}
                        />
                    )}
                    renderItem={({ item, index }) => (
                        <WorkorderListItem
                            item={item}
                            index={index}
                            dispatch={dispatch}
                            navigation={navigation}
                            userInfo={userInfo}
                        />
                    )}
                    onMomentumScrollBegin={() => {
                        if (haveHeaderPrompt === false && pageNumber > 2) {
                            // 只提示一次，且翻页页码大于2
                            this.setState({ haveHeaderPrompt: true }, () =>
                                setParams({ headerTip: true }),
                            );
                        }
                    }}
                    onMomentumScrollEnd={() => {
                        if (state.params && state.params.headerTip === true) {
                            this.timerScrollState = setTimeout(() =>
                                setParams({ headerTip: false }), 5000);
                        }
                    }}
                />
            </View>
        );
    }
}

WOGroup.propTypes = {
    loading: PropTypes.bool.isRequired,
    workorderList: PropTypes.array.isRequired,
    pageNumber: PropTypes.number.isRequired,
    pageLoading: PropTypes.bool.isRequired,
    loaded: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
    woProductItems: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
    ...state.workorder.woGroup,                     // 组内工单列表
    woProductItems: state.itemCode.woProductItems,  // 筛选条件：产品
    userInfo: state.user.userInfo,
});

export default connect(mapStateToProps)(WOGroup);

