"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Share2, RefreshCw, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// First 100 digits of Pi (including the 3)
const PI_DIGITS =
  "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"

// Funny feedback messages
const FEEDBACK_MESSAGES = [
  "Impressive! You've clearly wasted as much time as we have.",
  "Not bad! Have you considered a career in memorizing other useless constants?",
  "Well done! This skill will definitely help you solve real-world problems... said no one ever.",
  "Amazing! Your ability to memorize digits is inversely proportional to its practical value.",
  "Spectacular! Now if only there was a practical application for this skill...",
  "Congratulations! You've mastered a skill that calculators have had since the 1970s.",
  "Bravo! Your friends must be so impressed at parties.",
  "Outstanding! This is definitely more important than understanding mathematical concepts.",
  "Excellent! You're now qualified to... um... recite Pi at dinner parties?",
  "Phenomenal! Future employers will definitely ask you to recite Pi in production environments.",
]

export default function PiSimulator() {
  const [stage, setStage] = useState<"intro" | "interview" | "results">("intro")
  const [timeLeft, setTimeLeft] = useState(30)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<{
    correctDigits: number
    accuracy: number
    feedback: string
  } | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle timer
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (isTimerRunning && timeLeft === 0) {
      handleSubmit()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isTimerRunning, timeLeft])

  const startInterview = () => {
    setStage("interview")
    setTimeLeft(30)
    setInputValue("")
    setIsTimerRunning(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)
  }

  const handleSubmit = () => {
    setIsTimerRunning(false)
    if (timerRef.current) clearTimeout(timerRef.current)

    // Calculate results
    let correctCount = 0
    const userInput = inputValue.replace(/\s/g, "")
    const expectedInput = PI_DIGITS.substring(0, 50)

    for (let i = 0; i < Math.min(userInput.length, expectedInput.length); i++) {
      if (userInput[i] === expectedInput[i]) {
        correctCount++
      }
    }

    const accuracy = Math.round((correctCount / expectedInput.length) * 100)
    const feedbackIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length)

    setResults({
      correctDigits: correctCount,
      accuracy,
      feedback: FEEDBACK_MESSAGES[feedbackIndex],
    })

    setStage("results")
  }

  const shareResults = () => {
    if (!results) return

    const shareText = `I recited ${results.correctDigits} digits of Pi with ${results.accuracy}% accuracy on LeetPi.com! Can you beat my score?`

    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: "Now share your useless achievement with the world!",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Failed to copy",
          description: "Please manually copy your results.",
          variant: "destructive",
        })
      })
  }

  const resetSimulator = () => {
    setStage("intro")
    setTimeLeft(30)
    setInputValue("")
    setResults(null)
    setIsTimerRunning(false)
  }

  return (
    <div className="container max-w-3xl py-12 px-4 md:px-6">
      <Card className="w-full">
        {stage === "intro" && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Pi Recitation Interview</CardTitle>
              <CardDescription>
                Ready to prove your worth as a mathematician by memorizing digits instead of understanding concepts?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 text-blue-700">
                <p className="font-medium">Instructions:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>You will have 30 seconds to recite as many digits of Pi as you can</li>
                  <li>Start with 3.14... (the decimal point counts as a character)</li>
                  <li>The more digits you recite correctly, the more employable you are!</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Target: First 50 digits of Pi</p>
                <div className="font-mono text-lg bg-gray-100 p-3 rounded-lg">
                  3.14159265358979323846264338327950288419716939937...
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={startInterview} className="w-full bg-blue-600 hover:bg-blue-700">
                Start Pi Interview
              </Button>
            </CardFooter>
          </>
        )}

        {stage === "interview" && (
          <>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl">Recite Pi</CardTitle>
                <div className="flex items-center gap-2 text-red-500">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono font-bold">{String(timeLeft).padStart(2, "0")}s</span>
                </div>
              </div>
              <CardDescription>Type as many digits of Pi as you can remember</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={(timeLeft / 30) * 100} className="h-2" />
              <div className="space-y-2">
                <p className="font-medium">Recite the first 50 digits of Pi:</p>
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="3.14159..."
                  className="font-mono text-lg"
                  autoFocus
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSimulator}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                Submit Answer
              </Button>
            </CardFooter>
          </>
        )}

        {stage === "results" && results && (
          <>
            <CardHeader>
              <CardTitle className="text-2xl">Your Results</CardTitle>
              <CardDescription>
                Let's see how employable you are based on this completely relevant skill!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-1">Correct Digits</p>
                  <p className="text-3xl font-bold text-blue-700">{results.correctDigits}/50</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-700 mb-1">Accuracy</p>
                  <p className="text-3xl font-bold text-blue-700">{results.accuracy}%</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium mb-2">Feedback:</p>
                <p className="italic text-gray-700">{results.feedback}</p>
              </div>

              <div className="font-mono text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
                <p className="font-medium mb-1 text-gray-500">Your answer:</p>
                <p>{inputValue || "(No answer provided)"}</p>
                <p className="font-medium mb-1 mt-3 text-gray-500">Correct answer:</p>
                <p>{PI_DIGITS.substring(0, 50)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={resetSimulator} className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button onClick={shareResults} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                <Share2 className="mr-2 h-4 w-4" />
                Share Results
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}

