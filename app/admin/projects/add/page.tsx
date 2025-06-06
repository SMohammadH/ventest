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
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Project name must be at least 2 characters.',
  }),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  customerId: z.string().uuid({
    message: 'Please select a customer.',
  }),
  expertId: z.string().uuid({
    message: 'Please select an expert.',
  }),
})

type Customer = {
  id: string
  firstName: string
  lastName: string
}

type Expert = {
  id: string
  firstName: string
  lastName: string
}

export default function AddProjectPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [experts, setExperts] = useState<Expert[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      customerId: '',
      expertId: '',
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, expertsResponse] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/experts'),
        ])

        if (!customersResponse.ok || !expertsResponse.ok) {
          throw new Error('Failed to fetch data')
        }

        const customersData = await customersResponse.json()
        const expertsData = await expertsResponse.json()

        setCustomers(customersData.data)
        setExperts(expertsData.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        // You might want to add an error notification here
      }
    }
    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      form.reset()
      toast.success('Project created successfully')

      router.push('/admin/projects')
      router.refresh()
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto py-10'>
      <h1 className='text-2xl font-bold mb-6'>Add New Project</h1>
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
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter project name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter project address'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='customerId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a customer' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.firstName} {customer.lastName}
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
            name='expertId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expert</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select an expert' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {experts.map((expert) => (
                      <SelectItem
                        key={expert.id}
                        value={expert.id}
                      >
                        {expert.firstName} {expert.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
