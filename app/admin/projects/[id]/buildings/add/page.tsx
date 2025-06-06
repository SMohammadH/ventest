'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { addBuilding } from './actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { use, useState } from 'react'

const constructionTypes = [
  'Steel Frame',
  'Concrete Frame',
  'Wood Frame',
  'Masonry',
  'Mixed',
] as const

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  constructionType: z.enum(constructionTypes, {
    required_error: 'Please select a construction type',
  }),
  numberOfFloors: z.coerce
    .number()
    .min(1, 'Must have at least 1 floor')
    .max(200, 'Maximum 200 floors allowed'),
  numberOfUnits: z.coerce
    .number()
    .min(1, 'Must have at least 1 unit')
    .max(1000, 'Maximum 1000 units allowed'),
})

export default function AddBuildingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      constructionType: undefined,
      numberOfFloors: 1,
      numberOfUnits: 1,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      await addBuilding({ ...values, projectId: id })
      form.reset()
      toast.success('Building added successfully')
      router.push(`/admin/projects/${id}/buildings`)
      router.refresh()
    } catch (error) {
      toast.error('Failed to add building. Please try again.' + error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <div className='flex items-center gap-4 mb-6'>
        <Button
          variant='outline'
          size='icon'
          asChild
        >
          <Link href={`/admin/projects/${id}/buildings`}>
            <ArrowLeft className='h-4 w-4' />
          </Link>
        </Button>
        <h1 className='text-2xl font-bold'>Add New Building</h1>
      </div>
      <Card>
        <CardContent className='pt-6'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8'
            >
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Building A'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='constructionType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Construction Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select construction type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {constructionTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='numberOfFloors'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Floors</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={200}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='numberOfUnits'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Units</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={1}
                        max={1000}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Building'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
