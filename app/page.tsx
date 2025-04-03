import { CardContent } from "@/components/ui/card"
import { Card } from "@/components/ui/card"
import { PiSimulator } from "@/components/pi-simulator"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Embedded Simulator */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Ace Your Next Pi Interview
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Because memorizing digits is how we judge mathematicians now
              </p>
            </div>
          </div>

          {/* Embedded Pi Simulator */}
          <div className="max-w-3xl mx-auto">
            <PiSimulator autoStart={true} />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Testimonials</h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Don't take our word for it. Hear from our confused users.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 italic mb-4">
                    "I spent 6 months memorizing Pi instead of learning actual math. Got the job at FAANG. Worth it!"
                  </p>
                  <p className="font-semibold">- Anonymous Mathematician</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 italic mb-4">
                    "My interviewer was so impressed when I recited 100 digits. Then they asked me to solve an actual
                    problem and I failed miserably."
                  </p>
                  <p className="font-semibold">- Confused Candidate</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-500 italic mb-4">
                    "As a hiring manager, I exclusively hire people who can recite Pi. Our company has never been less
                    productive!"
                  </p>
                  <p className="font-semibold">- Tech Lead at BigCorp</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

