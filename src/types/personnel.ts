export type Page = "dashboard" | "personnel" | "payroll" | "reports";

export type Personnel = {
  id: number;
  name: string;
  position: string;
  phone: string;
  salary: number;
};
