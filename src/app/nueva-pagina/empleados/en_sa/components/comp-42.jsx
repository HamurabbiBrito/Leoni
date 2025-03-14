"use client";

import { cn } from "@/lib/utils";
import { RangeCalendar } from "@/app/nueva-pagina/empleados/en_sa/components/ui/calendar-rac";
import { DateInput, dateInputStyle } from "@/app/nueva-pagina/empleados/en_sa/components/ui/datefield-rac";
import { CalendarIcon } from "lucide-react";
import { Button, DateRangePicker, Dialog, Group, Popover } from "react-aria-components";

export default function Component({ onDateChange }) {
  return (
    <DateRangePicker
      className="*:not-first:mt-2"
      onChange={(range) => {
        console.log("Rango de fechas seleccionado:", range); // Verificar el objeto range

        // Extraer las fechas del objeto range
        const startDate = range.start;
        const endDate = range.end;

        console.log("Fechas extraídas:", { startDate, endDate }); // Verificar las fechas extraídas

        // Convertir las fechas a objetos Date
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        console.log("Fechas convertidas:", { startDateObj, endDateObj }); // Verificar las fechas convertidas

        // Llamar a la función onDateChange con las fechas seleccionadas
        if (onDateChange && startDateObj && endDateObj) {
          onDateChange({
            startDate: startDateObj,
            endDate: endDateObj,
          });
        }
      }}
    >
      <div className="flex">
        <Group className={cn(dateInputStyle, "pe-9 text-sm")}>
          <DateInput slot="start" unstyled className="w-20" />
          <span aria-hidden="true" className="text-muted-foreground/70 px-1">
            a
          </span>
          <DateInput slot="end" unstyled className="w-20" />
        </Group>
        <Button
          className="text-muted-foreground/80 hover:text-foreground data-focus-visible:border-ring data-focus-visible:ring-ring/50 z-10 -ms-9 -me-px flex w-8 h-8 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none data-focus-visible:ring-[3px]"
        >
          <CalendarIcon size={14} />
        </Button>
      </div>
      <Popover
        className="bg-background text-popover-foreground data-entering:animate-in data-exiting:animate-out data-[entering]:fade-in-0 data-[exiting]:fade-out-0 data-[entering]:zoom-in-95 data-[exiting]:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 rounded-md border shadow-lg outline-hidden"
        offset={4}
      >
        <Dialog className="max-h-[inherit] overflow-auto p-1">
          <RangeCalendar className="text-sm" />
        </Dialog>
      </Popover>
    </DateRangePicker>
  );
}