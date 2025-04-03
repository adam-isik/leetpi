"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Brain, Mail } from "lucide-react"

export default function About() {
  return (
    <div className="container max-w-3xl py-12 px-4 md:px-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About LeetPi</h1>
          <p className="text-gray-500 md:text-xl">The ultimate satire of technical interviews</p>
        </div>

        <div className="prose prose-blue max-w-none">
          <p>
            LeetPi was born from a simple observation: technical interviews have become as absurd as asking
            mathematicians to recite digits of Pi.
          </p>

          <p>
            Just as memorizing Pi has little to do with mathematical ability, solving contrived algorithm puzzles on a
            whiteboard has little to do with real-world engineering skills. Yet here we are, judging candidates based on
            their ability to reverse a binary tree or implement quicksort from memory.
          </p>

          <blockquote>
            "I used to think mathematics was about problem-solving and abstract thinking. Then I failed a job interview
            because I could only recite 42 digits of Pi. Now I know better."
            <cite>— Anonymous Mathematician</cite>
          </blockquote>

          <h2>Our Mission</h2>

          <p>
            Our mission is simple: to highlight the absurdity of technical interviews by creating an equally absurd
            parallel in another field. If software engineers must solve algorithm puzzles unrelated to their daily work,
            why shouldn't mathematicians recite Pi?
          </p>

          <p>
            By creating this satirical platform, we hope to spark conversations about more effective ways to evaluate
            candidates based on relevant skills rather than arbitrary measures.
          </p>

          <h2>I'm so meta!</h2>

          <p>
            Building LeetPi.com was hilariously simple - AI slapped together a timer, a text box, and some snarky
            feedback messages faster than most people can recite the first 10 digits of Pi! But let me tell you, running
            this satirical website is about as representative of actual web administration as LeetPi is of genuine
            software engineering skills. While I'm over here generating automated useless hints for people who mix up
            the 42nd and 43rd digits, real admins are dealing with security patches, database migrations, and that one
            user who keeps trying to SQL inject the contact form. Cut it out, Hassan.
          </p>

          <p>
            Got a ridiculous idea that deserves to exist on the internet? Reach out and we'll turn it into reality -
            because sometimes the best way to highlight absurdity is to build it, pixel by ridiculous pixel. Even if
            it's just for the lolz!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Looking for a real app instead?</h3>
                <p className="text-gray-600 mb-4">Connect with YouTubers</p>
                <Link href="https://creator-finder.adamisik.com/">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Try the Creator Finder <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Got a ridiculous idea?</h3>
                <p className="text-gray-600 mb-4">Let us 'borrow' your absurd ideas!</p>
                <Link href="mailto:funstuff@adamisik.com">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Email funstuff@adamisik.com <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="border-t pt-8">
          <p className="text-sm text-gray-500">
            <strong>Disclaimer:</strong> LeetPi is a satirical project meant to highlight the absurdity of certain
            technical interview practices. We have nothing against Pi – it's a wonderful constant that deserves better
            than being reduced to a memorization exercise.
          </p>
        </div>
      </div>
    </div>
  )
}

