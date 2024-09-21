import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Latest breakthroughs in quantum computing',
    message: 'What are the latest breakthroughs in quantum computing?'
  },
  {
    heading: 'Explain the concept of blockchain',
    message: 'Can you explain the concept of blockchain technology in simple terms?'
  },
  {
    heading: 'Advancements in renewable energy',
    message: 'What are the recent advancements in renewable energy technologies?'
  },
  {
    heading: 'Impact of AI on healthcare',
    message: 'How is artificial intelligence impacting the healthcare industry?'
  }
]

export function EmptyScreen({
  submitMessage,
  className
}: {
  submitMessage: (message: string) => void
  className?: string
}) {
  return (
    <div className={`mx-auto max-w-2xl transition-all ${className}`}>
      <div className="bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-gray-900 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-blue-600 dark:text-blue-300 mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-3" />
          Explore Topics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="ghost"
              className="flex items-start text-left h-auto p-5 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors duration-300 rounded-lg group"
              onClick={() => submitMessage(message.message)}
            >
              <ArrowRight size={18} className="mr-4 text-blue-500 dark:text-blue-300 mt-1 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              <div className="overflow-hidden">
                <p className="font-medium text-blue-700 dark:text-blue-200 mb-2 truncate">{message.heading}</p>
                <p className="text-sm text-blue-600 dark:text-blue-300 line-clamp-2">{message.message}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
