# How

```shell
npm i react-native-dropdown-list
```

```typescript
import { Option, useDropdownMenu } from 'react-native-dropdown-list'

const INIT_SELECTED_ID = '限价委托'
const OPTIONS: Option[] = [
  '限价委托',
  '高级限价委托',
  '止盈止损',
  '跟踪委托',
  '冰山委托',
  '时间加权委托',
].map(a => ({ id: a, title: a }))
const useOrderType = () => useDropdownMenu(OPTIONS, INIT_SELECTED_ID)

const App: FC = () => {
  const { btnRef, menu, selectedId, toggle } = useOrderType()

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Container>
        <Btn ref={btnRef} onPress={toggle}>
          <BtnText>{OPTIONS.filter(a => a.id === selectedId)[0].title}</BtnText>
        </Btn>
        {menu}
      </Container>
    </>
  )
}

export default App
```