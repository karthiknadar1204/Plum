'use client'

import { useEffect, useState, useRef } from 'react'
import type { AI } from '@/app/action'
import { useUIState, useActions, useAIState } from 'ai/rsc'
import { cn } from '@/lib/utils'
import { UserMessage } from './user-message'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ArrowRight, Plus, Square } from 'lucide-react'
import { EmptyScreen } from './empty-screen'

export function ChatPanel() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const [aiMessages, setAiMessages] = useAIState<typeof AI>()
  const { submit } = useActions<typeof AI>()
  const [isButtonPressed, setIsButtonPressed] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [showFollowupPanel, setShowFollowupPanel] = useState(false)

  useEffect(() => {
    if (isButtonPressed) {
      inputRef.current?.focus()
      setIsButtonPressed(false)
    }
  }, [isButtonPressed])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isButtonPressed) {
      handleClear()
      setIsButtonPressed(false)
    }

    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: Date.now(),
        isGenerating: false,
        component: <UserMessage message={input} />
      }
    ])

    const formData = new FormData(e.currentTarget)
    const responseMessage = await submit(formData)
    setMessages(currentMessages => [...currentMessages, responseMessage as any])

    setInput('')
    setShowFollowupPanel(true)
  }

  const handleClear = () => {
    setIsButtonPressed(true)
    setMessages([])
    setAiMessages([])
    setShowFollowupPanel(false)
  }

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const formPositionClass =
    messages.length === 0
      ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-b from-gray-900 to-black'
      : 'fixed bottom-20 md:bottom-24 left-0 right-0 mx-auto'

  return (
    <>
      <div className={formPositionClass}>
        {messages.length === 0 ? (
          <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
            <div className="relative flex items-center w-full">
              <Input
                ref={inputRef}
                type="text"
                name="input"
                placeholder="Ask a question..."
                value={input}
                className="pl-6 pr-12 py-4 h-14 rounded-full bg-gray-800 text-white shadow-md focus:ring-2 focus:ring-gray-600 transition-all duration-300"
                onChange={e => {
                  setInput(e.target.value)
                  setShowEmptyScreen(e.target.value.length === 0)
                }}
                onFocus={() => setShowEmptyScreen(true)}
                onBlur={() => setShowEmptyScreen(false)}
              />
              <Button
                type="submit"
                size={'icon'}
                variant={'ghost'}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600 transition-colors duration-300"
                disabled={input.length === 0}
              >
                <ArrowRight size={20} />
              </Button>
            </div>
            <EmptyScreen
              submitMessage={message => {
                setInput(message)
              }}
              className={cn(showEmptyScreen ? 'visible mt-6 animate-fade-in' : 'invisible')}
            />
          </form>
        ) : null}
      </div>
      {showFollowupPanel && (
        <div className="fixed bottom-0 left-0 right-0 p-4">
          <FollowupPanel onNewChat={handleClear} />
        </div>
      )}
    </>
  )
}

function FollowupPanel({ onNewChat }: { onNewChat: () => void }) {
  const [input, setInput] = useState('')
  const { submit } = useActions<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const userMessage = {
      id: Date.now(),
      isGenerating: false,
      component: <UserMessage message={input} isFirstMessage={false} />
    }

    const responseMessage = await submit(formData)
    setMessages(currentMessages => [
      ...currentMessages,
      userMessage,
      responseMessage
    ])

    setInput('')
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center space-x-1 w-full max-w-2xl mx-auto"
    >
      <Input
        type="text"
        name="input"
        placeholder="Ask a follow-up question..."
        value={input}
        className="pr-28 h-12 bg-gray-900 text-white border-gray-700"
        onChange={e => setInput(e.target.value)}
      />
      <div className="absolute right-1 flex space-x-1">
        <Button
          type="submit"
          size={'icon'}
          disabled={input.length === 0}
          variant={'ghost'}
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          <ArrowRight size={20} />
        </Button>
        <Button
          type="button"
          size={'icon'}
          variant={'ghost'}
          className="bg-gray-800 text-white hover:bg-gray-700"
          onClick={onNewChat}
        >
          <Plus size={20} />
        </Button>
      </div>
    </form>
  )
}
