import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import React, {
  forwardRef,
  RefForwardingComponent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import styled from 'styled-components'

import { Option, Rect } from './types'

const Container = styled(Modal)``
const Bg = styled(TouchableOpacity).attrs({ activeOpacity: 1 })`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
`
const Content = styled(View)`
  position: absolute;
  padding: 4px 0;

  border-radius: 4px;
`
const ContentScrollView = styled(ScrollView)`
  flex-grow: 0;
`
const OptionView = styled(TouchableOpacity)`
  padding: 8px;
`
const OptionBg = styled(View)<{ selected: boolean; tintColor: string }>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  background-color: ${props =>
    props.selected ? props.tintColor : 'transparent'};
  opacity: 0.08;
`
const OptionText = styled(Text)<{
  selected: boolean
  textColor: string
  tintColor: string
}>`
  color: ${props => (props.selected ? props.tintColor : props.textColor)};
  font-size: 12px;
  font-weight: bold;
`

export interface StyleProps {
  backgroundColor?: string
  tintColor?: string
  textColor?: string
  btnMenuSpacing?: number
  maxContentHeight?: number
}

interface Props extends StyleProps {
  options: Option[]
  selectedId: string
  onSelectId: (a: string) => void
}

export interface Handler {
  showFrom: (srcRect: Rect) => void
}

const Popup: RefForwardingComponent<Handler, Props> = (
  {
    options,
    selectedId,
    onSelectId,
    // styles
    backgroundColor = '#1b1e29',
    tintColor = '#00ccb8',
    textColor = '#d5dcf6',
    btnMenuSpacing = 4,
    maxContentHeight = 200,
  },
  ref,
) => {
  const [srcRect, setSrcRect] = useState<O.Option<Rect>>(O.none)
  const [visible, setVisible] = useState(false)
  const contentStyle: O.Option<ViewStyle> = useMemo(
    () =>
      pipe(
        srcRect,
        O.map(rect => ({
          top: rect.y + rect.height + btnMenuSpacing,
          left: rect.x,
          width: rect.width,
          maxHeight: maxContentHeight,
        })),
      ),
    [srcRect, btnMenuSpacing, maxContentHeight],
  )
  const onSelect = useCallback(
    (id: string) => {
      onSelectId(id)
      setVisible(false)
    },
    [onSelectId, setVisible],
  )

  useImperativeHandle(ref, () => ({
    showFrom: rect => {
      setSrcRect(O.some(rect))
      setVisible(true)
    },
  }))

  return pipe(
    contentStyle,
    O.map(contentStyle_ => (
      <Container animationType="fade" transparent={true} visible={visible}>
        <Bg onPress={() => setVisible(false)} />
        <Content style={[contentStyle_, { backgroundColor }]}>
          <ContentScrollView>
            {options.map(option => (
              <OptionView key={option.id} onPress={() => onSelect(option.id)}>
                <OptionBg
                  selected={selectedId === option.id}
                  tintColor={tintColor}
                />
                <OptionText
                  selected={selectedId === option.id}
                  textColor={textColor}
                  tintColor={tintColor}
                >
                  {option.title}
                </OptionText>
              </OptionView>
            ))}
          </ContentScrollView>
        </Content>
      </Container>
    )),
    O.toNullable,
  )
}

export default forwardRef(Popup)