import {
    StreamableValue,
    createAI,
    createStreamableUI,
    createStreamableValue,
    getMutableAIState
  } from 'ai/rsc'
  import { ExperimentalMessage } from 'ai'
  import { Spinner } from '@/components/ui/spinner'
  import { inquire, researcher, taskManager, querySuggestor } from '@/lib/agents'
  
  async function submit(formData?: FormData, skip?: boolean) {
    'use server'
  
    const aiState = getMutableAIState<typeof AI>()
    const uiStream = createStreamableUI()
    const isGenerating = createStreamableValue(true)
  
    const messages: ExperimentalMessage[] = aiState.get() as any
    const userInput = skip? `{"action": "skip"}`: (formData?.get('input') as string)
    const content = skip? userInput: formData? JSON.stringify(Object.fromEntries(formData)): null
    if (content) {
      const message = { role: 'user', content }
      messages.push(message as ExperimentalMessage)
      aiState.update([...(aiState.get() as any), message])
    }
  
    async function processEvents() {
      uiStream.update(<Spinner />)
  
      let action: any = { object: { next: 'proceed' } }
      if (!skip) action = await taskManager(messages)
  
      if (action.object.next === 'inquire') {
        const inquiry = await inquire(uiStream, messages)
  
        uiStream.done()
        isGenerating.done()
        aiState.done([...aiState.get(), { role: 'assistant', content: `inquiry: ${inquiry?.question}` }])
        return
      }
  
      
      let answer = ''
      const streamText = createStreamableValue<string>()
      while (answer.length === 0) {
        const { fullResponse } = await researcher(uiStream, streamText, messages)
        answer = fullResponse
      }
      streamText.done()
  
      await querySuggestor(uiStream, messages)
  
  
      isGenerating.done(false)
      uiStream.done()
      aiState.done([...aiState.get(), { role: 'assistant', content: answer }])
    }
  
    processEvents()
  
    return {
      id: Date.now(),
      isGenerating: isGenerating.value,
      component: uiStream.value
    }
  }
  
  const initialAIState: {
    role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
    content: string
    id?: string
    name?: string
  }[] = []
  
  const initialUIState: {
    id: number
    isGenerating: StreamableValue<boolean>
    component: React.ReactNode
  }[] = []
  
  export const AI = createAI({
    actions: {
      submit
    },
    initialUIState,
    initialAIState
  })
  