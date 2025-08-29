import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          Have a question or a comment? We'd love to hear from you.
        </p>
      </div>
      <div className="mt-12">
        <form action="#" method="POST" className="grid grid-cols-1 gap-y-6">
          <div>
            <Label htmlFor="name" className="sr-only">
              Full name
            </Label>
            <Input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              placeholder="Full name"
            />
          </div>
          <div>
            <Label htmlFor="email" className="sr-only">
              Email
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              placeholder="Email"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="sr-only">
              Phone
            </Label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              autoComplete="tel"
              placeholder="Phone"
            />
          </div>
          <div>
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              name="message"
              id="message"
              rows={4}
              placeholder="Message"
            />
          </div>
          <div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
