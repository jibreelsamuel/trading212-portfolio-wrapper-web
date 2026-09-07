type ValidationMessagesProps = {
  messages: string[]
}

/** Renders a list of validation / save errors. Null when empty. */
export function ValidationMessages({ messages }: ValidationMessagesProps) {
  if (messages.length === 0) {
    return null
  }

  return (
    <ul>
      {messages.map((message) => (
        <li key={message}>{message}</li>
      ))}
    </ul>
  )
}

export default ValidationMessages
