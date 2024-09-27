'use client'

import { useState } from 'react'
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CardContent, Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export interface SearchResultsProps {
  results: { title: string; url: string; content: string }[]
}

export function SearchResults({ results }: SearchResultsProps) {
  const [showAllResults, setShowAllResults] = useState(false)

  const handleViewMore = () => {
    setShowAllResults(true)
  }

  const displayedResults = showAllResults ? results : results.slice(0, 3)
  const additionalResultsCount = results.length > 3 ? results.length - 3 : 0

  return (
    <div className="flex flex-wrap bg-gray-900">
      {displayedResults.map((result: any, index: any) => (
        <div className="w-1/2 md:w-1/4 p-1" key={index}>
          <Link href={result.url} passHref target="_blank">
            <Card className="flex-1 bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-700">
              <CardContent className="p-2">
                <p className="text-xs line-clamp-2 text-gray-300">{result.content}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <Avatar className="h-4 w-4">
                    <AvatarImage
                      src={`https://www.google.com/s2/favicons?domain=${
                        new URL(result.url).hostname
                      }`}
                      alt={result.author}
                    />
                    <AvatarFallback className="bg-gray-700 text-gray-300">
                      {new URL(result.url).hostname[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-gray-500 truncate">
                    {new URL(result.url).hostname}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      ))}
      {!showAllResults && additionalResultsCount > 0 && (
        <div className="w-1/2 md:w-1/4 p-1">
          <Card className="flex-1 flex h-full items-center justify-center bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 border-gray-700">
            <CardContent className="p-2">
              <Button
                variant={'ghost'}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                onClick={handleViewMore}
              >
                View {additionalResultsCount} more
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
