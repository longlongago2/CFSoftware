/**
 * 群聊列表页面  右上角图标
 * created by zhangqi on 2018-2-2
 * */
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import HeaderTool from '../../components/HeaderTool';
import theme from '../../theme';

const HeaderRight = ({ dispatch }) => {
    function handlePress() {
        dispatch({
            type: 'Navigation/NAVIGATE',
            routeName: 'CreateChatGroup',
        });
    }
    return (
        <HeaderTool onPress={() => handlePress()}>
            <Icon
                size={25}
                name="plus"
                color={theme.header.foregroundColor}
            />
        </HeaderTool>
    );
};

HeaderRight.propTypes = {
    dispatch: PropTypes.func.isRequired,
};

export default connect()(HeaderRight);
