"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, Clock, AlertCircle, Copy, CheckCircle2 } from "lucide-react"
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

// Useless hints that appear as the user types
const USELESS_HINTS = [
  "Pro tip: Pi starts with 3. You're welcome.",
  "Remember, after 3 comes the decimal point!",
  "The next digit might be between 0 and 9. Just a hunch.",
  "Try visualizing the digits as tiny circles. It doesn't help, but it's fun!",
  "Did you know? Memorizing Pi won't actually make you better at math!",
  "The secret is to not think about pizza while reciting Pi.",
  "Fun fact: Knowing 100 digits of Pi is approximately 97 digits more than you'll ever need.",
  "Try the mnemonic: 'How I wish I could calculate pi.' It won't help you remember any digits though.",
  "The digits of Pi are like stars - countless and pointless to memorize!",
  "Have you tried turning your brain off and on again?",
  "Maybe the real Pi is the friends we made along the way.",
  "If you forget a digit, just make one up. No one will know the difference!",
  "Studies show that 0% of real-world problems require knowing Pi beyond 3.14.",
  "Remember: there's no 'i' in Pi. Wait, actually there is in the spelling. Nevermind.",
  "The key to memorizing Pi is to not have anything more important to do with your time.",
]

// Number emojis for sharing
const NUMBER_EMOJIS: Record<string, string> = {
  "0": "0️⃣",
  "1": "1️⃣",
  "2": "2️⃣",
  "3": "3️⃣",
  "4": "4️⃣",
  "5": "5️⃣",
  "6": "6️⃣",
  "7": "7️⃣",
  "8": "8️⃣",
  "9": "9️⃣",
  ".": "⏺️",
}

interface PiSimulatorProps {
  autoStart?: boolean
}

export function PiSimulator({ autoStart = false }: PiSimulatorProps) {
  const [stage, setStage] = useState<"intro" | "interview" | "results">(autoStart ? "interview" : "intro")
  const [timeLeft, setTimeLeft] = useState(30)
  const [inputValue, setInputValue] = useState("")
  const [results, setResults] = useState<{
    correctDigits: number
    accuracy: number
    feedback: string
    longestStreak?: number
    additionalFeedback?: string
    errorPositions?: number[]
    shareEmoji?: string
  } | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(autoStart)
  const [currentHint, setCurrentHint] = useState("")
  const [realTimeFeedback, setRealTimeFeedback] = useState({ correct: true, message: "" })
  const [isCopied, setIsCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hintTimerRef = useRef<NodeJS.Timeout | null>(null)

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

  // Auto-focus input when starting
  useEffect(() => {
    if (stage === "interview") {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [stage])

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart) {
      startInterview()
    }
  }, [autoStart])

  // Show random hints periodically based on user progress
  useEffect(() => {
    if (stage === "interview" && isTimerRunning) {
      const showRandomHint = () => {
        // Different categories of hints based on progress
        const beginnerHints = [
          "Pro tip: Pi starts with 3. You're welcome.",
          "Remember, after 3 comes the decimal point!",
          "The next digit might be between 0 and 9. Just a hunch.",
        ]

        const midProgressHints = [
          "Try visualizing the digits as tiny circles. It doesn't help, but it's fun!",
          "Did you know? Memorizing Pi won't actually make you better at math!",
          "The secret is to not think about pizza while reciting Pi.",
        ]

        const advancedHints = [
          "Fun fact: Knowing 100 digits of Pi is approximately 97 digits more than you'll ever need.",
          "Try the mnemonic: 'How I wish I could calculate pi.' It won't help you remember any digits though.",
          "The digits of Pi are like stars - countless and pointless to memorize!",
        ]

        const desperateHints = [
          "Have you tried turning your brain off and on again?",
          "Maybe the real Pi is the friends we made along the way.",
          "If you forget a digit, just make one up. No one will know the difference!",
          "Studies show that 0% of real-world problems require knowing Pi beyond 3.14.",
        ]

        // Select hint category based on input length
        let hintPool
        if (inputValue.length < 5) {
          hintPool = beginnerHints
        } else if (inputValue.length < 15) {
          hintPool = midProgressHints
        } else if (inputValue.length < 30) {
          hintPool = advancedHints
        } else {
          hintPool = desperateHints
        }

        const randomIndex = Math.floor(Math.random() * hintPool.length)
        setCurrentHint(hintPool[randomIndex])

        // Schedule next hint - shorter intervals as time runs out
        const timeRemaining = timeLeft / 30 // 1.0 to 0.0
        const baseDelay = 5000 // 5 seconds
        const minDelay = 2000 // 2 seconds
        const delay = Math.max(minDelay, baseDelay * timeRemaining)

        hintTimerRef.current = setTimeout(showRandomHint, delay)
      }

      // Show first hint
      showRandomHint()

      return () => {
        if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
      }
    }
  }, [stage, isTimerRunning, inputValue.length, timeLeft])

  // Real-time feedback as user types
  useEffect(() => {
    if (inputValue && stage === "interview") {
      const expectedInput = PI_DIGITS.substring(0, inputValue.length)

      // Count correct digits and find errors
      let correctCount = 0
      let lastCorrectIndex = -1
      const errors = []

      for (let i = 0; i < inputValue.length; i++) {
        if (i < expectedInput.length && inputValue[i] === expectedInput[i]) {
          correctCount++
          lastCorrectIndex = i
        } else {
          errors.push({
            position: i + 1,
            expected: i < expectedInput.length ? expectedInput[i] : "?",
            actual: inputValue[i],
          })
        }
      }

      // Generate dynamic feedback based on typing progress
      let message = ""

      // If they just added a new character
      if (inputValue.length > 0 && inputValue.length === lastCorrectIndex + 1) {
        const newDigitMessages = [
          "Nice! That's correct!",
          "Good memory!",
          "Yep, that's right!",
          "Another correct digit!",
          "Keep going, you're on fire!",
        ]
        message = newDigitMessages[Math.floor(Math.random() * newDigitMessages.length)]
      }
      // If they just made an error
      else if (errors.length > 0 && errors[errors.length - 1].position === inputValue.length) {
        const lastError = errors[errors.length - 1]
        const errorMessages = [
          `Oops! That ${lastError.actual} doesn't look right at position ${lastError.position}.`,
          `Hmm, I don't think that's a ${lastError.actual} at position ${lastError.position}.`,
          `Are you sure about that ${lastError.actual}? Doesn't seem right.`,
          `That ${lastError.actual} is definitely wrong. But who's counting? (We are.)`,
          `${lastError.actual}? Really? That's not even close!`,
        ]
        message = errorMessages[Math.floor(Math.random() * errorMessages.length)]
      }
      // If they're continuing to type after errors
      else if (errors.length > 0 && inputValue.length > errors[0].position) {
        const continuingMessages = [
          `You're still going after that mistake? Bold strategy!`,
          `${correctCount} digits correct so far, but who's counting those errors, right?`,
          `Keep typing! Accuracy is overrated anyway.`,
          `${errors.length} mistakes so far, but don't let that stop you!`,
          `You know you can start over, right? No? Okay, carry on then!`,
        ]
        message = continuingMessages[Math.floor(Math.random() * continuingMessages.length)]
      }

      setRealTimeFeedback({
        correct: errors.length === 0,
        message:
          message || (errors.length === 0 ? "Looking good so far!" : `First error at position ${errors[0].position}`),
      })
    } else {
      setRealTimeFeedback({ correct: true, message: "" })
    }
  }, [inputValue, stage])

  // Generate emoji representation for sharing
  const generateShareEmoji = (userInput: string, expectedInput: string) => {
    // First, convert the first few digits to number emojis (max 5)
    let emojiResult = ""
    const firstFewDigits = userInput.substring(0, Math.min(5, userInput.length))

    for (let i = 0; i < firstFewDigits.length; i++) {
      emojiResult += NUMBER_EMOJIS[firstFewDigits[i]] || firstFewDigits[i]
    }

    emojiResult += "\n"

    // Then add colored squares for correct/incorrect (max 15)
    const maxSquares = 15
    const displayLength = Math.min(maxSquares, userInput.length)

    for (let i = 0; i < displayLength; i++) {
      if (i < expectedInput.length && userInput[i] === expectedInput[i]) {
        emojiResult += "🟩" // Green for correct
      } else {
        emojiResult += "🟥" // Red for incorrect
      }

      // Add a space every 5 squares for readability
      if ((i + 1) % 5 === 0 && i < displayLength - 1) {
        emojiResult += " "
      }
    }

    return emojiResult
  }

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
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)

    // Calculate results
    let correctCount = 0
    let longestStreak = 0
    let currentStreak = 0
    const errorPositions = []

    const userInput = inputValue.replace(/\s/g, "")
    const expectedInput = PI_DIGITS.substring(0, 50)

    for (let i = 0; i < Math.min(userInput.length, expectedInput.length); i++) {
      if (userInput[i] === expectedInput[i]) {
        correctCount++
        currentStreak++
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak
        }
      } else {
        errorPositions.push(i + 1)
        currentStreak = 0
      }
    }

    // Calculate accuracy based on what the user actually entered, not the full 50 digits
    const accuracy =
      userInput.length > 0 ? Math.round((correctCount / Math.min(userInput.length, expectedInput.length)) * 100) : 0

    const feedbackIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length)

    // Additional analysis
    let additionalFeedback = ""
    if (longestStreak > 10) {
      additionalFeedback = `Impressive streak of ${longestStreak} consecutive digits!`
    } else if (errorPositions.length > 0 && errorPositions[0] <= 3) {
      additionalFeedback = "You couldn't even get past 3.14? Maybe try memorizing your phone number instead."
    } else if (correctCount < 5) {
      additionalFeedback = "Have you considered a career that doesn't involve numbers?"
    } else if (correctCount > 30) {
      additionalFeedback =
        "You've clearly spent way too much time on this. We're not sure whether to be impressed or concerned."
    }

    // Generate emoji representation for sharing
    const shareEmoji = generateShareEmoji(userInput, expectedInput)

    setResults({
      correctDigits: correctCount,
      accuracy,
      feedback: FEEDBACK_MESSAGES[feedbackIndex],
      longestStreak,
      additionalFeedback,
      errorPositions: errorPositions.slice(0, 5), // Just show first 5 errors
      shareEmoji,
    })

    setStage("results")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
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

  const shareResults = () => {
    if (!results) return

    const shareText = `I recited ${results.correctDigits} digits of Pi with ${results.accuracy}% accuracy on LeetPi.com!\n\n${results.shareEmoji}\n\nCan you beat my score? Try at https://leetpi.com`

    copyToClipboard(shareText)
  }

  const shareOnTwitter = () => {
    if (!results) return

    const shareText = `I recited ${results.correctDigits} digits of Pi with ${results.accuracy}% accuracy on LeetPi.com!\n\n${results.shareEmoji}\n\nCan you beat my score?`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent("https://leetpi.com")}`

    window.open(url, "_blank")
  }

  const shareOnFacebook = () => {
    if (!results) return

    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://leetpi.com")}&quote=${encodeURIComponent(`I recited ${results.correctDigits} digits of Pi with ${results.accuracy}% accuracy on LeetPi.com!`)}`

    window.open(url, "_blank")
  }

  const resetSimulator = () => {
    setStage("intro")
    setTimeLeft(30)
    setInputValue("")
    setResults(null)
    setIsTimerRunning(false)
    setCurrentHint("")
    setIsCopied(false)
  }

  return (
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
              <div className="font-mono text-lg bg-gray-100 p-3 rounded-lg">3.14...</div>
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
                placeholder="3.14..."
                className="font-mono text-lg"
                autoFocus
              />

              {/* Real-time feedback */}
              {inputValue && (
                <div
                  className={`text-sm mt-2 ${realTimeFeedback.correct ? "text-green-600" : "text-red-500"} flex items-center gap-1`}
                >
                  {!realTimeFeedback.correct && <AlertCircle className="h-4 w-4" />}
                  {realTimeFeedback.message}
                </div>
              )}

              {/* Random useless hint */}
              {currentHint && (
                <div className="bg-blue-50 p-3 rounded-lg mt-4 text-sm text-blue-700 italic">
                  <p className="font-medium mb-1">Hint:</p>
                  {currentHint}
                </div>
              )}
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
            <CardDescription>Let's see how employable you are based on this completely relevant skill!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Correct Digits</p>
                <p className="text-3xl font-bold text-blue-700">
                  {results.correctDigits}/{Math.min(inputValue.length, 50)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 mb-1">Accuracy</p>
                <p className="text-3xl font-bold text-blue-700">{results.accuracy}%</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium mb-2">Feedback:</p>
              <p className="italic text-gray-700">{results.feedback}</p>
              {results.additionalFeedback && <p className="italic text-gray-700 mt-2">{results.additionalFeedback}</p>}
              {results.longestStreak > 0 && (
                <p className="text-sm text-gray-600 mt-2">Longest streak: {results.longestStreak} digits</p>
              )}
              {results.errorPositions && results.errorPositions.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  First errors at positions: {results.errorPositions.join(", ")}
                  {results.errorPositions.length >= 5 ? "..." : ""}
                </p>
              )}
            </div>

            {/* Shareable emoji representation */}
            {results.shareEmoji && (
              <div className="bg-white border rounded-lg p-4">
                <p className="font-medium mb-2 text-gray-700">Share this result:</p>
                <div className="font-mono whitespace-pre-wrap mb-3">{results.shareEmoji}</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() =>
                      copyToClipboard(
                        `I recited ${results.correctDigits} digits of Pi with ${results.accuracy}% accuracy on LeetPi.com!\n\n${results.shareEmoji}\n\nCan you beat my score? Try at https://leetpi.com`,
                      )
                    }
                  >
                    {isCopied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={resetSimulator}>
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            <div className="font-mono text-sm bg-gray-100 p-3 rounded-lg overflow-x-auto">
              <p className="font-medium mb-1 text-gray-500">Your answer:</p>
              <p>{inputValue || "(No answer provided)"}</p>
              <p className="font-medium mb-1 mt-3 text-gray-500">Correct answer:</p>
              <p>{PI_DIGITS.substring(0, 50)}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {/* No footer content needed as Try Again button is moved to the share box */}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

