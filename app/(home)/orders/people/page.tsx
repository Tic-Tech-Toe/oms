// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Plus } from "lucide-react";
// import { mockCustomers } from "@/data/customers";
// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// const People = () => {
//   const [letter, setLetter] = useState("A");
//   const [showHint, setShowHint] = useState(false);
//   const [showAll, setShowAll] = useState(false); // Toggle for showing all contacts
//   const letterContainerRef = useRef(null);

//   useEffect(() => {
//     const container = letterContainerRef.current;

//     const handleScroll = (e:any) => {
//       e.preventDefault();
//       if (e.deltaX > 0) {
//         setShowAll(true);
//       } else if (e.deltaX < 0) {
//         setShowAll(false);
//       }
//       if (e.deltaY > 0) {
//         setLetter((prev) => {
//           const nextCharCode = prev.charCodeAt(0) + 1;
//           return nextCharCode <= 90 ? String.fromCharCode(nextCharCode) : "Z";
//         });
//       } else if (e.deltaY < 0) {
//         setLetter((prev) => {
//           const prevCharCode = prev.charCodeAt(0) - 1;
//           return prevCharCode >= 65 ? String.fromCharCode(prevCharCode) : "A";
//         });
//       }
//     };

//     if (container) {
//       container.addEventListener("wheel", handleScroll, { passive: false });
//     }

//     return () => {
//       if (container) {
//         container.removeEventListener("wheel", handleScroll);
//       }
//     };
//   }, []);

//   return (
//     <div className="p-4 h-[100dvh] md:mt-20 flex flex-col overflow-y-auto">
//       <h1 className="md:text-3xl text-2xl font-bold">People</h1>

//       {/* Letter changing div */}
//       <div
//         ref={letterContainerRef}
//         className="flex items-center justify-between  p-4 rounded-lg sticky top-20 "
//         onMouseEnter={() => setShowHint(true)}
//         onMouseLeave={() => setShowHint(false)}
//       >
//         <Dialog>
//           <DialogTrigger asChild>
//             <div className="h-20 w-20 aspect-square bg-purple-500 rounded-full flex items-center justify-center">
//               <span className="text-3xl font-bold">
//                 {showAll ? "All" : letter}
//               </span>
//             </div>
//           </DialogTrigger>
//           <DialogContent></DialogContent>
//         </Dialog>

//         {/* Show hint when hovering */}
//         {!showAll && showHint && (
//           <span className="text-xs font-bold px-2 py-1 bg-gray-700 text-white rounded-md hidden md:block">
//             Scroll to change letters
//           </span>
//         )}

//         <Button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 hover:text-white rounded-xl dark:bg-transparent">
//           <Plus size={16} /> Add contact
//         </Button>
//       </div>

//       {/* People List */}
//       <div className="mt-16 w-full border-2 p-2 min-h-[60%] rounded-xl overflow-y-auto grid md:grid-cols-3 auto-rows-min gap-4">
//         {mockCustomers.filter((cust) => showAll || cust.name.startsWith(letter))
//           .length === 0 ? (
//           <h1 className="text-center col-span-3 text-gray-500">No Data</h1>
//         ) : (
//           mockCustomers
//             .filter((cust) => showAll || cust.name.startsWith(letter))
//             .map((cust, i) => (
//               <div
//                 key={cust.id || i} // Prefer using a unique `id`
//                 className="py-2 px-4 transition-colors duration-300 rounded-xl gap-4 border-2 border-xl hover:bg-purple-600 cursor-pointer"
//               >
//                 <span>
//                   {cust.name}
//                   {i}
//                 </span>
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };


const People = () => {
  return(
    <h1>Work in progress</h1>
  )
}

export default People;