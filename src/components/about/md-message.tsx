import Image from 'next/image'
import Title from '../home/title'
import { TeamMember } from '@/services/teamService'
import { Skeleton } from '@/components/ui/skeleton'

export function MDMessageSkeleton() {
    return (
        <div className="py-10 md:py-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-64 mx-auto" />
                    <Skeleton className="h-6 w-96 mx-auto" />
                </div>

                <div className="grid md:grid-cols-2 mt-6 md:mt-16 gap-8 items-center">
                    <Skeleton className="h-[400px] md:h-[500px] rounded-lg" />

                    <div className="pt-4 border-t md:hidden border-border">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-36" />
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/6" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/6" />
                        </div>

                        <div className="pt-4 border-t border-border hidden md:block">
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function MDMessage({ data, isLoading }: { data: TeamMember | undefined; isLoading?: boolean }) {
    if (isLoading) {
        return <MDMessageSkeleton />
    }
    return (
        <div className="py-10 md:py-16 px-4 md:px-8">


            <div className="max-w-7xl mx-auto">
                <Title title='From Our Leadership' />
                <p className='md:text-xl  text-center mt-2'>What Our Leader has to say about lorem ispum dollar sir</p>

                <div className="grid lg:grid-cols-2 mt-6 md:mt-16 gap-8 items-center">
                    <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                        <Image
                            src={data?.image || "/brokenimg.jpg"}
                            alt={data?.fullname || "Managing Director"}
                            fill
                            quality={90}
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover object-top"
                            priority
                        />
                    </div>

                    <div className="pt-4 border-t text-center lg:text-left md:hidden border-border">
                        <p className="font-bold md:text-xl text-primary">{data?.fullname || ""}</p>
                        <p className="text-muted-foreground text-sm md:text-base">{data?.designation || ""}</p>
                    </div>

                    <div className="space-y-6 text-center lg:text-left">
                        <div className="text-sm md:text-lg leading-relaxed text-foreground space-y-4" dangerouslySetInnerHTML={{ __html: data?.description?.text || "" }}>

                        </div>

                        <div className="pt-4 border-t border-border hidden md:block">
                            <p className="font-bold md:text-xl text-primary">{data?.fullname || ""}</p>
                            <p className="text-muted-foreground text-sm md:text-base">{data?.designation || ""}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
