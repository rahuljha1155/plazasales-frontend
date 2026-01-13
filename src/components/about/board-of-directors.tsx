import React from 'react'
import Image from 'next/image'
import Title from '../home/title'
import { getAllTeamMembersServer, TeamMember } from '@/services/teamService'
import { MDMessage } from './md-message'
import { Icon } from '@iconify/react'
import Link from 'next/link'

export async function BoardOfDirectors() {
    let members: TeamMember[] = []

    try {
        const response = await getAllTeamMembersServer({ limit: 100 })
        members = response.data.members
    } catch (error) {
    }

    const CEO = members.find(member => member.isLeader === true)

    return (
        <>
            <MDMessage data={CEO} />

            <div className="py-12 md:py-28 px-4 md:px-8 bg-muted/80">
                <div className="max-w-7xl mx-auto">
                    <Title title='Board of Directors' wrapperClassName="!mb-1" />
                    <p className="text-center text-sm md:text-base text-muted-foreground mb-6 md:mb-12 max-w-2xl mx-auto">
                        Meet the visionary leaders steering Plaza Sales towards excellence and innovation
                    </p>

                    {members.length === 0 ? (
                        <p className="text-center text-muted-foreground">No team members found.</p>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="md:bg-background md:p-4  md:rounded-xl overflow-hidden hover:shadow-sm transition-shadow duration-300"
                                >
                                    <div className="relative h-64 lg:h-72 rounded-xl overflow-hidden bg-[#DF4225] w-full">
                                        <Image
                                            src={member.image || '/brokenimg.jpg'}
                                            alt={member.fullname}
                                            fill
                                            quality={90}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover object-top"
                                        />
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div className="  mt-4">
                                            <h3 className="text-xl  font-bold text-foreground">
                                                {member.fullname}
                                            </h3>
                                            <p className="text-primary font-semibold ">
                                                {member.designation}
                                            </p>
                                        </div>

                                        <div className="flex gap-4 flex-wrap  items-center">
                                            {member?.facebook && (
                                                <Link href={member?.facebook} target="_blank" rel="noopener noreferrer">
                                                    <span>
                                                        <Icon className='size-5' icon={"logos:facebook"} />
                                                    </span>
                                                </Link>
                                            )}
                                            {member?.twitter && (
                                                <Link href={member?.twitter} target="_blank" rel="noopener noreferrer">
                                                    <span>
                                                        <Icon className='size-5' icon={"skill-icons:instagram"} />
                                                    </span>
                                                </Link>
                                            )}
                                            {member?.linkedin && (
                                                <Link href={member?.linkedin} target="_blank" rel="noopener noreferrer">
                                                    <span>
                                                        <Icon className='size-5' icon={"logos:linkedin-icon"} />
                                                    </span>
                                                </Link>
                                            )}

                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}