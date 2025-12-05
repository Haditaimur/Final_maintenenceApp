// src/services/jobsService.ts
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

export type JobStatus = "urgent" | "todo" | "done";

export interface Job {
  id: string;
  hotelId: string;
  roomNumber: string;
  title: string;
  description: string;
  status: JobStatus;
  hasPhoto: boolean;
  createdAt?: any;
  updatedAt?: any;
  createdByRole?: "manager" | "handyman";
}

const JOBS_COLLECTION = "jobs";

export function subscribeToJobs(
  hotelId: string,
  callback: (jobs: Job[]) => void
) {
  const jobsRef = collection(db, JOBS_COLLECTION);
  const q = query(
    jobsRef,
    where("hotelId", "==", hotelId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(q, (snapshot) => {
    const jobs: Job[] = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as any),
    }));
    callback(jobs);
  });
}

export async function createJob(data: {
  hotelId?: string;
  roomNumber: string;
  title: string;
  description: string;
  status: JobStatus;
  createdByRole?: "manager" | "handyman";
}) {
  const jobsRef = collection(db, JOBS_COLLECTION);
  await addDoc(jobsRef, {
    hotelId: data.hotelId ?? "athena",
    roomNumber: data.roomNumber,
    title: data.title,
    description: data.description,
    status: data.status,
    hasPhoto: false,
    createdByRole: data.createdByRole ?? "manager",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const jobRef = doc(db, JOBS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}
