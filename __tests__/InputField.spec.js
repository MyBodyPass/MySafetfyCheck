import React from 'react'
import InputField from '../components/InputField'
import { render, fireEvent } from 'react-native-testing-library'
import Colors from '../Colors'

describe('InputField component', () => {
  it('should have a label', () => {
    const { getByTestId } = render(<InputField label="testlabel" />)

    expect(getByTestId('label')).not.toBeNull()
  })
  it('should have a label with text from property', () => {
    const { getByTestId } = render(<InputField label="This is the label" />)

    expect(getByTestId('label').props.children).toEqual('This is the label')
  })
  it('should call change handler if text changes', () => {
    const changeHandler = jest.fn()
    const { getByTestId } = render(<InputField onChange={changeHandler} />)
    fireEvent.changeText(getByTestId('input'), 'Hello World')

    expect(changeHandler).toHaveBeenCalledTimes(1)
    expect(changeHandler).toHaveBeenCalledWith('Hello World')
  })

  it('should render focused state after clicked', () => {
    const { getByTestId } = render(<InputField />)
    expect(
      getByTestId('input').props.style.reduce((prev, curr) => {
        return { ...prev, ...curr }
      }),
    ).toHaveProperty('borderColor', '#aaa')
    fireEvent(getByTestId('input'), 'onFocus')
    expect(
      getByTestId('input').props.style.reduce((prev, curr) => {
        return { ...prev, ...curr }
      }),
    ).toHaveProperty('borderColor', Colors.primaryColor)
  })

  it('should have a minimum height', () => {
    const { getByTestId } = render(<InputField />)
    expect(
      getByTestId('input').props.style.reduce((prev, curr) => {
        return { ...prev, ...curr }
      }),
    ).toHaveProperty('minHeight', 42)
  })
})
