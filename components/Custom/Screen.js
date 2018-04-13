import React from 'react';
import {
    View,
} from 'react-native';
import {create} from "../../defaults";

function Row({style = {}, children = null}) {
    return <View style={[styles.row, style]}>{children}</View>
}
Row.displayName = 'Screen.Row';

function Col({style = {}, flex = false, children = null}) {
    return <View style={[styles.col, flex ? styles.flex : {}, style]}>
        {children}
    </View>
}
Col.displayName = 'Screen.Col';

function Sheet({children, backgroundColor = '696969'}) {
    return <Col style={[styles.container, {backgroundColor}]}>
        {children}
    </Col>;
}
Sheet.displayName = 'Screen.Sheet';
Sheet.builder = {
    get style() {
        return {
            backgroundColor(value) {
                return {backgroundColor: value}
            }
        };
    }
};

const styles = create({
    col: {
        flexDirection: 'column'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flex: {
        flex: 1
    },
    container: {
        flex: 1,
        padding: 0,
        margin: 0
    }
});

module.exports = {
    Col, Row, Sheet
};