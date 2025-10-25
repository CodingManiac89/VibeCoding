import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveTextContent(text: string): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(className: string): R
      toBeVisible(): R
      toBeDisabled(): R
      toBeEnabled(): R
      toHaveValue(value: string | number): R
    }
  }
}
