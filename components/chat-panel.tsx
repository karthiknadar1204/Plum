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

  if (messages.length > 0 && !isButtonPressed) {
    return (
      <div className="fixed bottom-4 md:bottom-8 left-0 right-0 flex flex-col justify-center items-center mx-auto">
        {showFollowupPanel && <FollowupPanel />}
        <Button
          type="button"
          variant={'secondary'}
          className="rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 group transition-all duration-300 hover:scale-105 mt-4"
          onClick={() => handleClear()}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            New Chat
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all duration-300" />
        </Button>
      </div>
    )
  }

  const formPositionClass =
    messages.length === 0
      ? 'fixed inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900'
      : 'fixed bottom-4 md:bottom-8 left-0 right-0 mx-auto'

  return (
    <div className={formPositionClass}>
      <form onSubmit={handleSubmit} className="max-w-2xl w-full px-6">
        <div className="relative flex items-center w-full">
          <Input
            ref={inputRef}
            type="text"
            name="input"
            placeholder="Ask a question..."
            value={input}
            className="pl-6 pr-12 py-4 h-14 rounded-full bg-white dark:bg-gray-800 shadow-md focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 transition-all duration-300"
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors duration-300"
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
    </div>
  )
}
















function FollowupPanel() {
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
      className="relative flex items-center space-x-1 w-full max-w-2xl"
    >
      <Input
        type="text"
        name="input"
        placeholder="Ask a follow-up question..."
        value={input}
        className="pr-14 h-12"
        onChange={e => setInput(e.target.value)}
      />
      <Button
        type="submit"
        size={'icon'}
        disabled={input.length === 0}
        variant={'ghost'}
        className="absolute right-1"
      >
        <ArrowRight size={20} />
      </Button>
    </form>
  )
}
