import { Topic } from "../entities/Topic";

export interface TopicRepositories {
  save(topic: Topic): Promise<void>;

  getById(id: string): Promise<Topic | null>;

  getByTitle(title: string): Promise<Topic | null>;

  delete(id: string): Promise<void>;
}
