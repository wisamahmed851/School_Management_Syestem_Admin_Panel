import { apiClient } from "./client";
import { CLASS_SUBJECTS } from "./endpoints";
import type {
  ClassSubjectsByClassResponse,
  ClassSubjectsByTeacherResponse,
  ClassSubjectResponse,
  ClassSubjectDeleteResponse,
  CreateClassSubjectPayload,
  UpdateClassSubjectPayload,
} from "@/types/class-subject";

export const classSubjectsApi = {
  byClass: async (classId: number | string): Promise<ClassSubjectsByClassResponse> => {
    const res = await apiClient.get<ClassSubjectsByClassResponse>(
      CLASS_SUBJECTS.BY_CLASS(classId)
    );
    return res.data;
  },

  byTeacher: async (teacherId: number | string): Promise<ClassSubjectsByTeacherResponse> => {
    const res = await apiClient.get<ClassSubjectsByTeacherResponse>(
      CLASS_SUBJECTS.BY_TEACHER(teacherId)
    );
    return res.data;
  },

  create: async (
    payload: CreateClassSubjectPayload
  ): Promise<ClassSubjectResponse> => {
    const res = await apiClient.post<ClassSubjectResponse>(
      CLASS_SUBJECTS.STORE,
      payload
    );
    return res.data;
  },

  update: async (
    id: number | string,
    payload: UpdateClassSubjectPayload
  ): Promise<ClassSubjectResponse> => {
    const res = await apiClient.put<ClassSubjectResponse>(
      CLASS_SUBJECTS.UPDATE(id),
      payload
    );
    return res.data;
  },

  remove: async (id: number | string): Promise<ClassSubjectDeleteResponse> => {
    const res = await apiClient.delete<ClassSubjectDeleteResponse>(
      CLASS_SUBJECTS.REMOVE(id)
    );
    return res.data;
  },
};
