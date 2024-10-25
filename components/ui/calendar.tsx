import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { cn } from "@/lib/utils";

export type CalendarProps = React.ComponentProps<typeof Calendar>;

function CustomCalendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <Calendar
      className={cn("p-3", className)}
      prevLabel={<span>&lt;</span>}
      nextLabel={<span>&gt;</span>}
      prev2Label={null}
      next2Label={null}
      minDetail="month"
      {...props}
    />
  );
}

CustomCalendar.displayName = "Calendar";

export { CustomCalendar as Calendar };