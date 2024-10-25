import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DoctorSpecializationFieldProps {
  form: UseFormReturn<{
    role: "DOCTOR" | "PATIENT";
    specialization?: string;
    location?: string;
    name?: string;
  }>;
  activeRole: "DOCTOR" | "PATIENT" | null;
  onFilterChange: (filters: { specialization?: string; location?: string; name?: string }) => void;
}

export function DoctorSpecializationField({ form, activeRole, onFilterChange }: DoctorSpecializationFieldProps) {
  const [filters, setFilters] = useState({
    specialization: '',
    location: '',
    name: '',
  });
  const router = useRouter();

  useEffect(() => {
    // Whenever the filters change, call the onFilterChange prop
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSpecializationChange = (value: string) => {
    form.setValue("specialization", value || '');
    setFilters((prev) => ({ ...prev, specialization: value }));
    
    // Construct the search query
    const searchParams = new URLSearchParams();
    if (value) searchParams.append('specialization', value);
    if (filters.location) searchParams.append('location', filters.location);
    if (filters.name) searchParams.append('name', filters.name);
    
    // Navigate to the search results page with the updated filters
    router.push(`/doctors/search?${searchParams.toString()}`);
  };

  if (activeRole !== "DOCTOR") return null;

  return (
    <FormField
      control={form.control}
      name="specialization"
      render={() => (
        <FormItem>
          <FormLabel>Specialization</FormLabel>
          <Select
            onValueChange={handleSpecializationChange}
            value={form.getValues("specialization") || ''}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a specialization" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="dermatology">Dermatology</SelectItem>
              {/* Add more specializations as needed */}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}