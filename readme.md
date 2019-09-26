## rn-scrollable-picker
A pure JS scrollable picker solution for react-native, highly customizable.

-Auto height detection

![example](./res/demo.gif)


## Usage

```shell
npm i rn-scrollable-picker
```

```jsx
import React, {Component} from 'react';
import ScrollPicker from 'rn-scrollable-picker';

export default class SimpleExample extends Component {


    handleClick = (index, options, onValueChange) => {
        this.sp.scrollToIndex(index);   // select 'c'
        onValueChange(options[index]);
    }

    render() {
        return(
            <ScrollPicker
                ref={(sp) => {this.sp = sp}}
                dataSource={options}
                selectedIndex={0}
                itemHeight={ITEM_HEIGHT}
                wrapperHeight={500}
                wrapperStyle={{
                    backgroundColor: 'transparent'
                }}
                renderItem={(data, index, isSelected) => {
                    return(
                        <TouchableOpacity 
                        onPress={() => this.handleClick(index, options, onValueChange)} 
                        style={{height: ITEM_HEIGHT}}>
                            <Text style={isSelected ? {
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontSize: 34,
                                    height: 50,
                                    fontWeight: 'bold'
                                } : {
                                    color: '#fff',
                                    textAlign: 'center',
                                    fontSize: 20,
                                    height: 50,
                                    fontWeight: '300'
                                }}
                            >
                                {data}
                            </Text>
                        </TouchableOpacity>
                    )
                }}
                onValueChange={(data, selectedIndex) => {
                    onValueChange(options[selectedIndex]);
                }}
            />
    );
    }
}

```

## Props

| Prop                 | Required | Default      | Params type             | Description                         |
| -------------------- | -------- | ------------ | ----------------------- | ----------------------------------- |
| dataSource           | yes      |              | Array                   | Picker data                         |
| wrapperHeight        | yes      |              | Number                  | Picker window height                |
| renderItem           | no       |              | Function                | Renders picker options              |
| selectedIndex        | no       | 0            | Number                  | Default selected value              |
| onValueChange        | no       | () => {}     | Function                | Called on valie change              |
| highlightStyle       | no       |              | Style array             | Called when epg boundaries are left |
| wrapperStyle         | no       |              | Style array             | Called when epg boundaries are left |
| itemHeight           | no       | 30           | Number                  | Picker's single item height         |
| fixedHeight          | no       | false        | Bool                    | Disable dynamic height calculation  |
| rotationEnabled      | no       | true         | Bool                    | Auto rotation support which is calling `handleWrapperHeightChange` method  |

## Default styles

```jsx
        wrapperStyle = {
            height: this.wrapperHeight,
            flex: 1,
            overflow: 'hidden',
        },
        highlightStyle = {
            position: 'absolute',
            top: (this.wrapperHeight - this.itemHeight) / 2,
            height: this.itemHeight,
            width: highlightWidth,
        },
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
```


## Contributors ✨

Thanks goes to these wonderful people :shipit:

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/kasinskas"><img src="https://avatars1.githubusercontent.com/u/22332217?v=4" width="64px;" alt="Rokas Kašinskas"/><br /><sub><b>Rokas Kašinskas</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/lukebars"><img src="https://avatars0.githubusercontent.com/u/46403446?v=4" width="64px;" alt="Lukas Baranauskas"/><br /><sub><b>Lukas Baranauskas</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/veizz"><img src="https://avatars3.githubusercontent.com/u/1176926?v=4" width="64px;" alt="veizz"/><br /><sub><b>veizz</b></sub></a><br /></td>
    <td align="center"><a href="https://www.linkedin.com/in/rafanascmag/"><img src="https://avatars1.githubusercontent.com/u/10750521?v=4" width="64px;" alt="Rafael Magalhães"/><br /><sub><b>Rafael Magalhães</b></sub></a><br /></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
