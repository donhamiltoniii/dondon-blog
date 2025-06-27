import { type CollectionEntry, getCollection } from "astro:content";


// Type definitions
export type Note = CollectionEntry<'notes'>;
export type Notes = Note[]

export type GetNotes = () => Promise<Notes>;
export type ParaSection = 'projects' | 'areas' | 'resources' | 'archives'
export type GetSectionNotes = (section: ParaSection) => Promise<Notes>;

export interface CategoryData {
  notes: Notes;
  subcategories: Record<string, CategoryData>;
}

export interface OrganizedNotes {
  [key: string]: CategoryData;
}

export interface CategorySectionProps {
  name: string;
  data: CategoryData;
  level?: number;
}

// Get all notes
export const getNotes: GetNotes = async () =>
  await getCollection("notes");

// Get all notes based on section
export const getSectionNotes: GetSectionNotes = async (section) => {
  const notes = await getNotes()
  const sectionNotes = notes.filter(note => note.slug.includes(`${section}/`))

  return sectionNotes
}

export const allNotes = await getNotes()

// Function to organize posts by directory structure
export function organizePostsByDirectory(notes: Notes): OrganizedNotes {
  const organized: OrganizedNotes = {};

  notes.forEach((note: Note) => {
    const pathParts: string[] = note.slug.split('/');
    pathParts.pop(); // Remove the filename

    // Build nested structure
    let current: Record<string, CategoryData> = organized;
    pathParts.forEach((part: string, index: number) => {
      if (!current[part]) {
        current[part] = {
          notes: [],
          subcategories: {}
        };
      }

      // If this is the last part of the path, add the post
      if (index === pathParts.length - 1) {
        current[part].notes.push(note);
      }

      current = current[part].subcategories;
    });

    // Handle posts in root directory
    if (pathParts.length === 0) {
      if (!organized._root) {
        organized._root = { notes: [], subcategories: {} };
      }
      organized._root.notes.push(note);
    }
  });

  return organized;
}

export const organizedNotes: OrganizedNotes = organizePostsByDirectory(allNotes);