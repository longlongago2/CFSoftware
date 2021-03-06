/** created by zhangqi on 2017-9-8 */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import api from '../../utils/api';

export default class WODetailImageList extends PureComponent {
    constructor(props) {
        super(props);
        this.handleImagePreview = this._handleImagePreview.bind(this);
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.timerImagePreview);
    }

    _handleImagePreview(initialPage) {
        const { dispatch, workOrderDetail } = this.props;
        this.timerImagePreview = requestAnimationFrame(() => {
            const images = workOrderDetail.workordermediass.map(item => (
                { url: `${api.database}/${item.mediainfo}` }
            ));
            dispatch({
                type: 'Navigation/NAVIGATE',
                routeName: 'ImagesPreview',
                params: {
                    images,
                    initialPage,
                },
            });
        });
    }

    render() {
        const { workOrderDetail } = this.props;
        return (
            <View>
                {
                    Array.isArray(workOrderDetail.workordermediass)
                    && workOrderDetail.workordermediass.length > 0 &&
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'stretch',
                    }}
                    >
                        <Text style={{ flex: 0.25 }}>图片描述</Text>
                        <View
                            style={{
                                flex: 0.75,
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                justifyContent: 'flex-start',
                                alignItems: 'stretch',
                            }}
                        >
                            {
                                workOrderDetail.workordermediass.map((item, i) => (
                                    <View
                                        key={item.mediacode}
                                        style={{
                                            width: 65,
                                            height: 65,
                                            flex: -1,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => this.handleImagePreview(i)}
                                        >
                                            <FastImage
                                                source={{ uri: `${api.database}/${item.mediainfo}` }}
                                                resizeMethod={FastImage.resizeMode.cover}
                                                style={{ width: 60, height: 60 }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                }
            </View>
        );
    }
}

WODetailImageList.propTypes = {
    dispatch: PropTypes.func.isRequired,
    workOrderDetail: PropTypes.object.isRequired,
};
