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
import { addEee } from './actions'
import { useRouter } from 'next/navigation'

const eeeTypes = [
  'Balcony',
  'Deck',
  'Porch',
  'Stair',
  'Walkway',
  'Other',
] as const

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  type: z.enum(eeeTypes, {
    required_error: 'Please select an EEE type',
  }),
  floor: z.coerce
    .number()
    .min(1, 'Floor must be at least 1')
    .max(200, 'Floor cannot exceed 200'),
  unit: z.string().min(1, 'Unit is required'),
})

interface EeeFormProps {
  projectId: string
  buildingId: string
  numberOfFloors: number
}

export function EeeForm({
  projectId,
  buildingId,
  numberOfFloors,
}: EeeFormProps) {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: undefined,
      floor: 1,
      unit: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addEee({ ...values, buildingId })
      router.push(`/admin/projects/${projectId}/buildings/${buildingId}/eees`)
      router.refresh()
    } catch {
      alert('Failed to add EEE. Please try again.')
    }
  }

  return (
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
                      placeholder='Balcony A'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select EEE type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eeeTypes.map((type) => (
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
              name='floor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Floor</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={numberOfFloors}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='unit'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='101'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit'>Add EEE</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
