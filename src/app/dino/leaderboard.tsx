/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";

export default function LeaderBoard() {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px] text-center">#</TableHead>
          <TableHead className="w-[200px]">Username</TableHead>
          <TableHead className="w-[100px]">Score</TableHead>
          <TableHead className="w-[150px]">Country</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <TableCell className="text-center font-medium">1</TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="text-blue-500 hover:underline"
                prefetch={false}
              >
                @username1
              </Link>
            </div>
          </TableCell>
          <TableCell className="text-center">1500</TableCell>
          <TableCell className="flex items-center justify-center">
            <span className="sr-only">United States</span>
            <FlagIcon className="w-6 h-4" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <TableCell className="text-center font-medium">2</TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="text-blue-500 hover:underline"
                prefetch={false}
              >
                @username2
              </Link>
            </div>
          </TableCell>
          <TableCell className="text-center">1400</TableCell>
          <TableCell className="flex items-center justify-center">
            <span className="sr-only">United Kingdom</span>
            <FlagIcon className="w-6 h-4" />
          </TableCell>
        </TableRow>
        <TableRow className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
          <TableCell className="text-center font-medium">3</TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="text-blue-500 hover:underline"
                prefetch={false}
              >
                @username3
              </Link>
            </div>
          </TableCell>
          <TableCell className="text-center">1300</TableCell>
          <TableCell className="flex items-center justify-center">
            <span className="sr-only">France</span>
            <FlagIcon className="w-6 h-4" />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function FlagIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}
