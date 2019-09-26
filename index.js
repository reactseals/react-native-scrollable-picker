

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Platform,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

export default class ScrollPicker extends Component {
    constructor(props) {
        super(props);

        this.itemHeight = this.props.itemHeight;
        const { dataSource, itemHeight, wrapperHeight, fixedHeight } = props;

        this.wrapperHeight = fixedHeight ? wrapperHeight : dataSource.length * itemHeight < wrapperHeight ? dataSource.length * itemHeight : wrapperHeight;

        this.state = {
            selectedIndex: this.props.selectedIndex
        };
    }

    componentDidMount() {
        if (this.props.selectedIndex) {
            setTimeout(() => {
                this.scrollToIndex(this.props.selectedIndex);
            }, 0);
        }
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    handleWrapperHeightChange = () => {
        const {
            dataSource, itemHeight, wrapperHeight, fixedHeight
        } = this.props;

        const { selectedIndex } = this.state;

        const height = fixedHeight ? wrapperHeight : dataSource.length * itemHeight < wrapperHeight ? dataSource.length * itemHeight : wrapperHeight;

        if (height!==this.wrapperHeight) {
            this.wrapperHeight = height;
            this.scrollToIndex(selectedIndex);
        }
    }

    render() {
        const { header, footer } = this._renderPlaceHolder();
        const {
            wrapperStyle, highlightStyle, itemHeight, rotationEnabled
        } = this.props;

        if(rotationEnabled) {
            this.handleWrapperHeightChange();
        }

        return (
            <View style={[
                    { height: this.wrapperHeight }, 
                    wrapperStyle
                ]}>
                <View style={[
                        {
                            top: (this.wrapperHeight - this.itemHeight) / 2,
                            height: this.itemHeight
                        }, 
                        highlightStyle
                    ]} />
                <ScrollView
                    ref={(sview) => { this.sview = sview; }}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    onMomentumScrollBegin={this._onMomentumScrollBegin.bind(this)}
                    onMomentumScrollEnd={this._onMomentumScrollEnd.bind(this)}
                    onScrollBeginDrag={this._onScrollBeginDrag.bind(this)}
                    onScrollEndDrag={this._onScrollEndDrag.bind(this)}
                    scrollEventThrottle={16}
                    snapToAlignment="center"
                    decelerationRate="fast"
                    snapToInterval={itemHeight}
                >
                    {header}
                    {this.props.dataSource.map(this._renderItem.bind(this))}
                    {footer}
                </ScrollView>
            </View>
        );
    }

    _renderPlaceHolder() {
        const h = (this.wrapperHeight - this.itemHeight) / 2;
        const header = <View style={{ height: h, flex: 1 }} />;
        const footer = <View style={{ height: h, flex: 1 }} />;
        return { header, footer };
    }

    _renderItem(data, index) {
        const isSelected = index === this.state.selectedIndex;
        let item = <Text style={isSelected ? [styles.itemText, styles.itemTextSelected] : styles.itemText}>{data}</Text>;

        if (this.props.renderItem) {
            item = this.props.renderItem(data, index, isSelected);
        }

        return (
            <View style={[styles.itemWrapper, { height: this.itemHeight }]} key={index}>
                {item}
            </View>
        );
    }

    _scrollFix(e) {
        let y = 0;
        const h = this.itemHeight;
        if (e.nativeEvent.contentOffset) {
            y = e.nativeEvent.contentOffset.y;
        }
        const selectedIndex = Math.round(y / h);
        // const _y = selectedIndex * h;
        // if (_y !== y) {
            // using scrollTo in ios, onMomentumScrollEnd will be invoked
            // if(Platform.OS === 'ios'){
            //     this.isScrollTo = true;
            // }
            // this.sview.scrollTo({y:_y});
        // }
        if (this.state.selectedIndex === selectedIndex) {
            return;
        }
        if (this.props.onValueChange) {
            const selectedValue = this.props.dataSource[selectedIndex];
            this.setState({
                selectedIndex,
            });
            this.props.onValueChange(selectedValue, selectedIndex);
        }
    }

    _onScrollBeginDrag() {
        this.dragStarted = true;
        if (Platform.OS === 'ios') {
            this.isScrollTo = false;
        }
        this.timer && clearTimeout(this.timer);
    }

    _onScrollEndDrag(e) {
        this.dragStarted = false;
        // if not used, event will be garbaged
        const _e = {
            nativeEvent: {
                contentOffset: {
                    y: e.nativeEvent.contentOffset.y,
                },
            },
        };
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(
            () => {
                if (!this.momentumStarted && !this.dragStarted) {
                    this._scrollFix(_e, 'timeout');
                }
            },
            10
        );
    }

    _onMomentumScrollBegin(e) {
        this.momentumStarted = true;
        this.timer && clearTimeout(this.timer);
    }

    _onMomentumScrollEnd(e) {
        this.momentumStarted = false;
        if (!this.isScrollTo && !this.momentumStarted && !this.dragStarted) {
            this._scrollFix(e);
        }
    }

    scrollToIndex(ind) {
        this.setState({
            selectedIndex: ind,
        });
        const y = this.itemHeight * ind;
        if (this.sview) {
            this.sview.scrollTo({ y });
        }
    }

    getSelected() {
        const { selectedIndex } = this.state;
        const selectedValue = this.props.dataSource[selectedIndex];
        return selectedValue;
    }
}

let styles = StyleSheet.create({
    itemWrapper: {
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        color: '#999',
    },
    itemTextSelected: {
        color: '#333',
    },
});

ScrollPicker.propTypes = {
        style: ViewPropTypes.style,
        dataSource: PropTypes.array.isRequired,
        selectedIndex: PropTypes.number,
        onValueChange: PropTypes.func,
        renderItem: PropTypes.func,
        highlightStyle: ViewPropTypes.style,
        itemHeight: PropTypes.number,
        wrapperStyle: ViewPropTypes.style,
        wrapperHeight: PropTypes.height,
        fixedHeight: PropTypes.bool,
        rotationEnabled: PropTypes.bool,
};

ScrollPicker.defaultProps = {
    onValueChange: () => {},
    itemHeight: 30,
    selectedIndex: 0,
    fixedHeight: false,
    rotationEnabled: true,
    highlightStyle: {
        position: 'absolute',
        width: '100%',
    },
    wrapperStyle: {
        flex: 1,
        overflow: 'hidden',
    },
}