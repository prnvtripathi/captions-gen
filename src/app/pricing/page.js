import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import PageHeaders from "@/components/PageHeaders"

export default function PricingComponent() {
    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeaders heading="Pricing" subHeading="Choose a plan that works for you" />
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free Plan</CardTitle>
                        <CardDescription>Perfect for occasional use</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-3xl font-bold mb-4">$0 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>2 files per day</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Basic caption editing</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Standard processing speed</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">Get Started</Button>
                    </CardFooter>
                </Card>

                {/* Paid Plan */}
                <Card className="flex flex-col border-primary opacity-60 cursor-not-allowed">
                    <CardHeader>
                        <CardTitle className="text-2xl">Pro Plan</CardTitle>
                        <CardDescription>For power users and businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-3xl font-bold mb-4">$6 <span className="text-base font-normal text-muted-foreground">/month</span></p>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Unlimited uploads</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Advanced caption editing</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Priority processing</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Multiple language support</span>
                            </li>
                            <li className="flex items-center">
                                <Check className="mr-2 h-4 w-4 text-primary" />
                                <span>Caption customization</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full cursor-not-allowed" variant="default">Subscribe Now</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}