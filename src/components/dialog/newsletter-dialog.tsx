"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Icon } from '@iconify/react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { BorderBeam } from '../ui/border-beam'
import { api } from '@/config/axios.config'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'

const newsletterSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

export default function NewsletterDialog() {


    const [isOpen, setIsOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [recaptchaReady, setRecaptchaReady] = useState(false);
    const { executeRecaptcha } = useGoogleReCaptcha();

    const form = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: {
            email: '',
            name: '',
        }
    })

    useEffect(() => {
        // Check recaptcha readiness
        if (executeRecaptcha) {
            setRecaptchaReady(true)
        }
    }, [executeRecaptcha]);

    useEffect(() => {
        const hasSubscribed = localStorage.getItem('newsletter_subscribed')
        const hasClosed = sessionStorage.getItem('newsletter_closed')

        if (!hasSubscribed && !hasClosed) {
            const timer = setTimeout(() => {
                setIsOpen(true)
            }, 2000)

            return () => clearTimeout(timer)
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false)
        sessionStorage.setItem('newsletter_closed', 'true')
    }

    const onSubmit = async (data: NewsletterFormData) => {
        setIsSubmitting(true)

        if (!executeRecaptcha) {
            toast.error('Please wait, security check is loading...', {
                description: 'Please try again in a moment.',
                position: 'top-right',
            })
            setIsSubmitting(false)
            return
        }

        let token: string;
        try {
            token = await executeRecaptcha('newslettersubscribe')

            if (!token) {
                throw new Error('Failed to obtain recaptcha token')
            }
        } catch {
            toast.error('Security verification failed', {
                description: 'Please refresh the page and try again.',
                position: 'top-right',
            })
            setIsSubmitting(false)
            return
        }

        try {
            const response = await api.post('/newsletter/subscribe', data, {
                headers: { "X-Recaptcha-Token": token }
            });



            toast.success(response?.data?.message || 'Subscribed successfully!', {
                description: 'Thank you! for subscription. You will start receiving our newsletters.',
                icon: null,
                descriptionClassName: "text-zinc-200! mt-2!",
                className: "text-white! bg-green-500! ",
                position: 'top-right',
            });

            localStorage.setItem('newsletter_subscribed', 'true')
            setIsOpen(false)
            form.reset()

        } catch (error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            toast.error(err?.response?.data?.message || 'An error occurred',
                {
                    description: 'Please check your details and try again.',
                    icon: null,
                    descriptionClassName: "text-zinc-200! mt-2!",
                    className: "text-white! bg-red-500! ",
                    position: 'top-right',
                }

            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-md w-full! sm:w-full rounded-2xl p-4 sm:p-6 overflow-hidden backdrop-blur-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom-4 data-[state=closed]:slide-out-to-right-4 data-[state=open]:slide-in-from-bottom-4 data-[state=open]:slide-in-from-right-4 z-100"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
            >
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogHeader className='gap-2 '>
                            <div className="flex items-center gap-2">
                                <DialogTitle className='text-xl'>Subscribe to Our Newsletter</DialogTitle>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Get the latest updates and exclusive offers delivered to your inbox.
                            </p>
                        </DialogHeader>

                        <div className="grid gap-4 mt-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder='Your Name'
                                                {...field}
                                                className='py-5 rounded-lg px-4 border-[1.5px]'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder='Your Email'
                                                {...field}
                                                className='py-5 rounded-lg px-4 border-[1.5px]'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='flex gap-3 mt-6'>
                            <button
                                type="button"
                                onClick={handleClose}
                                className='flex w-full sm:w-1/2 justify-center hover:bg-primary items-center hover:text-white  bg-transparent border-primary border text-primary rounded-full text-xs! md:text-base  py-2! lg:py-3! '
                            >
                                Maybe Later
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !recaptchaReady}
                                className='flex w-full sm:w-1/2 justify-center items-center hover:bg-transparent hover:border-primary border hover:text-primary text-white  bg-primary rounded-full text-xs! md:text-base  py-2! lg:py-3!'

                            >
                                {isSubmitting ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="w-5 h-5 mr-2" />
                                        Subscribing...
                                    </>
                                ) : !recaptchaReady ? (
                                    <>
                                        <Icon icon="eos-icons:loading" className="w-5 h-5 mr-2" />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        Subscribe
                                        <Icon icon="ph:paper-plane-tilt-light" className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </Form>
                <BorderBeam colorFrom='#E98388' colorTo='#E98388' duration={4} size={200} />
            </DialogContent>
        </Dialog>
    )
}
