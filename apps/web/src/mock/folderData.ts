import type { Folder } from "../types/folder";

export const mockFolders: Folder[] = [
  {
    id: "1",
    name: "Documents",
    path: "/Documents",
    children: [
      {
        id: "1-1",
        name: "Work",
        path: "/Documents/Work",
        children: [
          {
            id: "1-1-1",
            name: "Projects",
            path: "/Documents/Work/Projects",
            children: [],
          },
          {
            id: "1-1-2",
            name: "Reports",
            path: "/Documents/Work/Reports",
            children: [
              {
                id: "1-1-2-1",
                name: "Q1-2024",
                path: "/Documents/Work/Reports/Q1-2024",
                children: [],
              },
              {
                id: "1-1-2-2",
                name: "Q2-2024",
                path: "/Documents/Work/Reports/Q2-2024",
                children: [],
              },
            ],
          },
        ],
      },
      {
        id: "1-2",
        name: "Personal",
        path: "/Documents/Personal",
        children: [],
      },
    ],
  },
  {
    id: "2",
    name: "Downloads",
    path: "/Downloads",
    children: [
      {
        id: "2-1",
        name: "Software",
        path: "/Downloads/Software",
        children: [],
      },
    ],
  },
  {
    id: "3",
    name: "Pictures",
    path: "/Pictures",
    children: [
      {
        id: "3-1",
        name: "Vacation",
        path: "/Pictures/Vacation",
        children: [
          {
            id: "3-1-1",
            name: "2024",
            path: "/Pictures/Vacation/2024",
            children: [
              {
                id: "3-1-1-1",
                name: "Vacation",
                path: "/Pictures/Vacation",
                children: [
                  {
                    id: "3-1-1-1-1",
                    name: "2029",
                    path: "/Pictures/Vacation/2024",
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];
