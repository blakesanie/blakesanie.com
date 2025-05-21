// import React from "react";
//
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
//
// interface DatePickerProps {
//   defaultValue: Date;
//   onBlur?: (d: Date) => void;
// }
//
// const DatePicker: React.FC<DatePickerProps> = ({ defaultValue, onBlur }) => {
//   const [date, setDate] = React.useState<Date>();
//   const [hasInteraction, setHasInteraction] = React.useState(false);
//   // return <p>test</p>;
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-[280px] justify-start text-left font-normal",
//             !date && "text-muted-foreground",
//           )}
//         >
//           {date ? date.toLocaleString() : <span>Pick a date</span>}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0">
//         <Calendar
//           mode="single"
//           selected={hasInteraction ? date : defaultValue}
//           onSelect={(date) => {
//             setHasInteraction(true);
//             setDate(date);
//           }}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// };
//
// export default DatePicker;
