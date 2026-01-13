'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FileText, X, MapPin, Briefcase, Clock, Building2, AlertCircle } from 'lucide-react'
import { ICareerFormData, careerSchema } from '@/schema/career-schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { getCareerById, submitCareerApplication } from '@/services/careerService'
import { ICareerDetail } from '@/types/ICareer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from '@iconify/react'
import { TransitionLink } from '@/components/shared'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import CustomBreadcrumb from '@/components/ui/custom-breadcum'


const jobTypeMap: Record<string, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
};

export default function ApplyPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [job, setJob] = useState<ICareerDetail | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showNotFound, setShowNotFound] = useState(false)


  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setFetchLoading(true)
        const response = await getCareerById(params.slug as string)
        setJob(response.career)
      } catch (err) {
        setShowNotFound(true)
      } finally {
        setFetchLoading(false)
      }
    }

    fetchCareer()
  }, [params.slug])

  const form = useForm<ICareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      position: job?.title || '',
      careerId: job?.id || '',
      resumeUrl: undefined,
      coverLetterUrl: undefined
    }
  })

  // Update position when job is loaded
  useEffect(() => {
    if (job) {
      form.setValue('position', job.title)
      form.setValue('careerId', job.id)
    }
  }, [job, form])

  // Handler to validate trusted events for inputs
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (value: string) => void
  ) => {
    if (!e.isTrusted) {
      return;
    }
    onChange(e.target.value);
  };

  // Handler to validate trusted events for file uploads
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | undefined) => void
  ) => {
    if (!e.isTrusted) {
      return;
    }
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleSubmit = async (data: ICareerFormData) => {
    if (!job) return;

    if (!executeRecaptcha) {
      return
    }

    const token = await executeRecaptcha('apply_for_job')

    setLoading(true)
    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('email', data.email)
      formData.append('phone', data.phone)
      formData.append('position', data.position)
      formData.append('careerId', job.id)

      if (data.resumeUrl) {
        formData.append('resumeUrl', data.resumeUrl)
      }

      if (data.coverLetterUrl) {
        formData.append('coverLetterUrl', data.coverLetterUrl)
      }

      const response = await submitCareerApplication(formData, token)

      if (response.status === 201 || response.status === 200) {
        setShowSuccessModal(true)
        form.reset()
      } else {
        setShowErrorModal(true)
      }

    } catch (error) {
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (showNotFound || !job) {
    return (
      <main>
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-[90dvh] md:px-8">
          <div className="max-w-xl mx-auto space-y-3 text-center">
            <h3 className="text-primary font-semibold">
              404 Error
            </h3>
            <p className="text-gray-800 uppercase text-4xl font-semibold sm:text-5xl">
              Job not found
            </p>
            <p className="text-gray-600">
              Sorry, the job you are looking for could not be found or has been removed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <TransitionLink href="/career" className="block py-2 px-6 bg-primary/80 hover:bg-primary text-white rounded-sm">
                View All Jobs
              </TransitionLink>
              <TransitionLink href="/contact" className="block py-2 px-6 border border-primary text-primary hover:bg-primary hover:text-white rounded-sm">
                Need Help
              </TransitionLink>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const paths = [
    { name: "Home", href: "/" },
    { name: "Career", href: "/career" },
    { name: job?.title || "Job Details", href: `/career/${job?.id}` },
    { name: "Apply", href: "#" }
  ];

  return (
    <div className="min-h-screen  ">
      <div className="mb-4 py-2 bg-muted/80">
        <CustomBreadcrumb paths={paths} className='bg-transparent' />
      </div>
      <div className="max-w-7xl mx-auto px-4 xl:px-0 pb-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Application Form - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg  ">
              <div className="mb-4 md:mb-8">
                <h1 className="text-xl md:text-3xl font-bold mb-2">Apply for Position</h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Please fill out the form below to submit your application
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 ">

                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className='gap-0'>
                          <FormLabel className='text-sm md:text-[16px] '>
                            Full Name <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              className='py-2 md:py-3 rounded-full md:rounded-full border-zinc-400'
                              value={field.value}
                              onChange={(e) => handleInputChange(e, field.onChange)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email Field */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className='gap-0'>
                          <FormLabel className='text-sm md:text-[16px]'>
                            Email Address <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              className='py-2 md:py-3 rounded-full md:rounded-xl border-zinc-400'
                              placeholder=""
                              value={field.value}
                              onChange={(e) => handleInputChange(e, field.onChange)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone Field */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className='gap-0'>
                          <FormLabel className='text-sm md:text-[16px]'>
                            Phone Number <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className='py-2 md:py-3 rounded-full md:rounded-xl border-zinc-400'
                              type="tel"
                              value={field.value}
                              onChange={(e) => handleInputChange(e, field.onChange)}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />


                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem className='gap-0'>
                          <FormLabel className='text-sm md:text-[16px]'>Position</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              disabled
                              defaultValue={job?.title}
                              className="bg-muted py-2 md:py-3 rounded-full md:rounded-xl border-zinc-400"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>



                  {/* Resume Upload */}
                  <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className='gap-0'>
                        <FormLabel className='text-sm md:text-[16px]'>
                          Resume/CV <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {!value ? (
                            <div className="relative">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, onChange)}
                                className="hidden"
                                id="resume"
                                {...fieldProps}
                              />
                              <label
                                htmlFor="resume"
                                className="flex items-center py-2 md:py-3 rounded-md md:rounded-xl border-zinc-400 justify-center w-full h-32 border-2 border-dashed  cursor-pointer hover:bg-muted/50 transition-colors "
                              >
                                <div className="text-center">
                                  {/* <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" /> */}
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload resume
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC, or DOCX (max 5MB)
                                  </p>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 border rounded-md">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div>
                                  <p className="font-medium text-sm">{value.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(value.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(undefined)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cover Letter Upload (Optional) */}
                  <FormField
                    control={form.control}
                    name="coverLetterUrl"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem className='gap-0'>
                        <FormLabel className='text-sm md:text-[16px]'>
                          Cover Letter Document (Optional)
                        </FormLabel>
                        <FormControl>
                          {!value ? (
                            <div className="relative">
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={(e) => handleFileChange(e, onChange)}
                                className="hidden"
                                id="coverLetterFile"
                                {...fieldProps}
                              />
                              <label
                                htmlFor="coverLetterFile"
                                className="flex items-center justify-center w-full h-32 border-2 border-dashed py-2 md:py-3 rounded-md md:rounded-md border-zinc-400  cursor-pointer hover:bg-muted/50 transition-colors "
                              >
                                <div className="text-center">
                                  {/* <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" /> */}
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload cover letter
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC, or DOCX (max 5MB)
                                  </p>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-8 w-8 text-blue-500" />
                                <div>
                                  <p className="font-medium text-sm">{value.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(value.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onChange(undefined)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                  <div className="flex justify-end items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      className="px-4  border border-primary  text-sm md:text-[16px] rounded-full md:rounded-full"
                      disabled={loading}
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          {/* Sidebar - Job Details */}
          <div className="lg:col-span-1 mt-5 md:mt-0">
            <div className="sticky top-20 space-y-6">
              {/* Job Summary Card */}
              <div className="bg-white rounded-xl  md:border border-gray-100 md:p-6">
                <h3 className="text-2xl font-semibold mb-1">Position Details</h3>

                {job ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="md:font-medium text-lg text-primary mb-3">
                        {job.title}
                      </h4>
                      <div className="space-y-3 mt-4 text-sm">
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm md:text-[16px] text-zinc-800">Department</p>
                            <p className="font-medium text-gray-700">{job.department}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm md:text-[16px] text-zinc-800">Location</p>
                            <p className="font-medium text-gray-700">{job.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Briefcase className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm md:text-[16px] text-zinc-800">Employment Type</p>
                            <p className="font-medium text-gray-700">{jobTypeMap[job.jobType] || job.jobType}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-gray-800 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm md:text-[16px] text-zinc-800">Salary Range</p>
                            <p className="font-medium text-gray-700">{job.salaryRange}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600">
                    <p className="text-sm">Loading job details...</p>
                  </div>
                )}
              </div>

              {/* Contact Support Card */}
              <div className="bg-white rounded-lg  border border-gray-100 p-6 hidden md:block">
                <h3 className="text-lg font-bold mb-3">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about this position or the application process, feel free to contact us.
                </p>
                <TransitionLink
                  href="/contact"
                  className="inline-block w-full text-center border border-primary text-primary py-2 rounded-full font-medium text-lg hover:bg-gray-200 transition-colors "
                >
                  Contact Us
                </TransitionLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ">
              <Icon icon={"garden:check-badge-fill-12"} className='size-12 text-green-500' />
            </div>
            <DialogTitle className="text-center text-xl">Application Submitted!</DialogTitle>
            <DialogDescription className="text-center">
              Thank you for applying! We&apos;ve received your application and will review it shortly.
              We&apos;ll contact you if your qualifications match our requirements.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => {
                setShowSuccessModal(false)
                router.push('/career')
              }}
              variant={"outline"}
              className="w-full bg-transparent text-primary ho"
            >
              <Icon icon={"icon-park-outline:arrow-left"} /> Back to Careers
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl">Submission Failed</DialogTitle>
            <DialogDescription className="text-center">
              We encountered an error while submitting your application. Please try again later or contact us directly.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 mt-4">
            <Button
              onClick={() => setShowErrorModal(false)}
              variant="outline"
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
