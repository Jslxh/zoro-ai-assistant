/**
 * Represents an employee with their name, email, role, and department.
 */
export interface Employee {
  /**
   * The name of the employee.
   */
  name: string;
  /**
   * The email address of the employee.
   */
  email: string;
  /**
   * The role of the employee.
   */
  role: string;
  /**
   * The department of the employee.
   */
  department: string;
}

const SENDER_EMAIL = 'myzoroai@gmail.com';

/**
 * Sends an email to the specified recipient with the given subject and body.
 *
 * @param recipient The email address of the recipient.
 * @param subject The subject of the email.
 * @param body The body of the email.
 * @returns A promise that resolves when the email is sent successfully.
 */
export async function sendEmail(
  recipient: string,
  subject: string,
  body: string
): Promise<void> {
  // TODO: Implement this by calling an email API.
  console.log(
    `Sending email from ${SENDER_EMAIL} to ${recipient} with subject '${subject}' and body:\n${body}`
  );
}

let employees: Employee[] = [
    {
      name: 'JayJay',
      email: 'nezukodvl@gmail.com',
      role: 'Manager',
      department: 'Engineering',
    },
    {
      name: 'Sundareeshwaran',
      email: 'sanjaychili838@gmail.com',
      role: 'Software Intern',
      department: 'Development',
    },
    {
      name: 'Jayshu',
      email: 'jayashreejananis@gmail.com',
      role: 'Team Lead',
      department: 'Sales',
    },
    {
      name: 'Jasper Jean Mariano',
      email: 'shreejayalakshmis@gmail.com',
      role: 'Project Manager',
      department: 'Product Management',
    },
    {
      name: 'Kim Taehyung',
      email: 'taehyungie.kim@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
    {
      name: 'Jeon Jungkook',
      email: 'jungkook.jeon@example.com',
      role: 'Sales Representative',
      department: 'Sales',
    },
  
    {
      name: 'Yuri',
      email: 'yuri.hanamitchi@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Namjoon',
      email: 'namjoonhyung.kim@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Calix',
      email: 'calix.sece@example.com',
      role: 'Analyst',
      department: 'Product Management',
    },
    {
      name: 'CiN',
      email: 'cin.pernalta@example.com',
      role: 'Analyst',
      department: 'Finance',
    },
    {
      name: 'Park Jimin',
      email: 'jiminshi.mochi@example.com',
      role: 'Accountant',
      department: 'Finance',
    },
    {
      name: 'Mark Keifer Watson',
      email: 'keifer.mulloch@example.com',
      role: 'HR',
      department: 'Human Resources',
    },
    {
      name: 'Kim Seok Jin',
      email: 'jinhyung.kim@example.com',
      role: 'Recruiter',
      department: 'Human Resources',
    },
    {
      name: 'Min Yoongi',
      email: 'agustd.suga@example.com',
      role: 'Intern',
      department: 'Engineering',
    },
    {
      name: 'Jung Hoseok',
      email: 'hobihyung.hoba@example.com',
      role: 'Intern',
      department: 'Marketing',
    },
    {
      name: 'Sandhana',
      email: 'jayasandhanamari@gmail.com',
      role: 'Project Manager',
      department: 'Product Management',
    },
    {
      name: 'Haruto Watanabe',
      email: 'haruto.watanabe@example.com',
      role: 'UI/UX Designer',
      department: 'Design',
    },
    {
      name: 'Asahi Hamada',
      email: 'asahi.hamada@example.com',
      role: 'UI/UX Designer',
      department: 'Design',
    },
    {
      name: 'Mashiho Takata',
      email: 'mashiho.takata@example.com',
      role: 'QA Engineer',
      department: 'Engineering',
    },
    {
      name: 'Yoon Jaehyuk',
      email: 'yoon.jaehyuk@example.com',
      role: 'DevOps Engineer',
      department: 'Engineering',
    },
    {
      name: 'Choi Hyunsuk',
      email: 'choi.hyunsuk@example.com',
      role: 'Team Lead',
      department: 'Engineering',
    },
    {
      name: 'Park Jihoon',
      email: 'park.jihoon@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Kanemoto Yoshinori',
      email: 'yoshi.kanemoto@example.com',
      role: 'Developer',
      department: 'Engineering',
    },
    {
      name: 'Kim Doyoung',
      email: 'kim.doyoung@example.com',
      role: 'Marketing Specialist',
      department: 'Marketing',
    },
    {
      name: 'Bang Yedam',
      email: 'bang.yedam@example.com',
      role: 'Content Creator',
      department: 'Marketing',
    },
    {
      name: 'So Junghwan',
      email: 'so.junghwan@example.com',
      role: 'Sales Associate',
      department: 'Sales',
    },
    {
      name: 'Kim Junkyu',
      email: 'kim.junkyu@example.com',
      role: 'Customer Support',
      department: 'Support',
    },
    {
      name: 'Park Jeongwoo',
      email: 'park.jeongwoo@example.com',
      role: 'Customer Support',
      department: 'Support',
    },
    {
      name: 'Lee Heeseung',
      email: 'lee.heeseung@example.com',
      role: 'Product Owner',
      department: 'Product Management',
    },
    {
      name: 'Jay Park',
      email: 'jay.park@example.com',
      role: 'Data Scientist',
      department: 'Data Science',
    },
    {
      name: 'Jake Sim',
      email: 'jake.sim@example.com',
      role: 'Data Analyst',
      department: 'Data Science',
    },
    { name: 'Sunghoon Park', email: 'sunghoon.park@example.com', role: 'Developer', department: 'Engineering' },
    { name: 'Sunoo Kim', email: 'sunoo.kim@example.com', role: 'UI/UX Designer', department: 'Design' },
    { name: 'Jungwon Yang', email: 'jungwon.yang@example.com', role: 'Team Lead', department: 'Engineering' },
    { name: 'Ni-ki Nishimura', email: 'niki.nishimura@example.com', role: 'Intern', department: 'Engineering' },
    { name: 'Karina Yu', email: 'karina.yu@example.com', role: 'Manager', department: 'Marketing' },
    { name: 'Giselle Aeri', email: 'giselle.aeri@example.com', role: 'Marketing Specialist', department: 'Marketing' },
    { name: 'Winter Kim', email: 'winter.kim@example.com', role: 'Content Creator', department: 'Marketing' },
    { name: 'Ningning Yizhuo', email: 'ningning.yizhuo@example.com', role: 'Analyst', department: 'Finance' },
    { name: 'Yeji Hwang', email: 'yeji.hwang@example.com', role: 'Team Lead', department: 'Sales' },
    { name: 'Lia Choi', email: 'lia.choi@example.com', role: 'Sales Representative', department: 'Sales' },
    { name: 'Ryujin Shin', email: 'ryujin.shin@example.com', role: 'Sales Associate', department: 'Sales' },
    { name: 'Chaeryeong Lee', email: 'chaeryeong.lee@example.com', role: 'Customer Support', department: 'Support' },
    { name: 'Yuna Shin', email: 'yuna.shin@example.com', role: 'Recruiter', department: 'Human Resources' },
    { name: 'Sullyoon Seol', email: 'sullyoon.seol@example.com', role: 'HR Manager', department: 'Human Resources' },
    { name: 'Haewon Oh', email: 'haewon.oh@example.com', role: 'Project Manager', department: 'Product Management' },
    { name: 'Lily Jin', email: 'lily.jin@example.com', role: 'Product Owner', department: 'Product Management' },
    { name: 'Jiwoo Kim', email: 'jiwoo.kim@example.com', role: 'QA Engineer', department: 'Engineering' },
    { name: 'Kyujin Jang', email: 'kyujin.jang@example.com', role: 'DevOps Engineer', department: 'Engineering' },
    { name: 'Bae Jin-sol', email: 'bae.jinsol@example.com', role: 'Data Scientist', department: 'Data Science' },
    { name: 'Minji Kim', email: 'minji.kim@example.com', role: 'Manager', department: 'Data Science' },
    { name: 'Hanni Pham', email: 'hanni.pham@example.com', role: 'Data Analyst', department: 'Data Science' },
    { name: 'Danielle Marsh', email: 'danielle.marsh@example.com', role: 'UI/UX Designer', department: 'Design' },
    { name: 'Hyein Lee', email: 'hyein.lee@example.com', role: 'Intern', department: 'Design' },
    { name: 'Sakura Miyawaki', email: 'sakura.miyawaki@example.com', role: 'Team Lead', department: 'Design' },
    { name: 'Chaewon Kim', email: 'chaewon.kim@example.com', role: 'Developer', department: 'Engineering' },
    { name: 'Yunjin Huh', email: 'yunjin.huh@example.com', role: 'Developer', department: 'Engineering' },
    { name: 'Kazuha Nakamura', email: 'kazuha.nakamura@example.com', role: 'Accountant', department: 'Finance' },
    { name: 'Eunchae Hong', email: 'eunchae.hong@example.com', role: 'Analyst', department: 'Finance' },
    { name: 'Rei Naoi', email: 'rei.naoi@example.com', role: 'Marketing Specialist', department: 'Marketing' },
    { name: 'Wonyoung Jang', email: 'wonyoung.jang@example.com', role: 'Content Creator', department: 'Marketing' },
];

/**
 * Retrieves a list of employees from a data source.
 *
 * @returns A promise that resolves to an array of Employee objects.
 */
export async function getEmployees(): Promise<Employee[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...employees];
}

/**
 * Adds a new employee to the list.
 *
 * @param employee The employee to add.
 * @returns A promise that resolves when the employee is added.
 * @throws An error if an employee with the same email already exists.
 */
export async function addEmployee(employee: Employee): Promise<Employee> {
  await new Promise(resolve => setTimeout(resolve, 300));
  if (employees.find(e => e.email.toLowerCase() === employee.email.toLowerCase())) {
    throw new Error('An employee with this email already exists.');
  }
  employees.push(employee);
  return employee;
}

/**
 * Updates an existing employee.
 *
 * @param email The email of the employee to update.
 * @param employeeData The data to update.
 * @returns A promise that resolves to the updated employee.
 * @throws An error if the employee is not found.
 */
export async function updateEmployee(email: string, employeeData: Partial<Omit<Employee, 'email'>>): Promise<Employee> {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = employees.findIndex(e => e.email.toLowerCase() === email.toLowerCase());
  if (index === -1) {
    throw new Error('Employee not found.');
  }
  employees[index] = { ...employees[index], ...employeeData };
  return employees[index];
}

/**
 * Deletes an employee.
 *
 * @param email The email of the employee to delete.
 * @returns A promise that resolves when the employee is deleted.
 */
export async function deleteEmployee(email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  employees = employees.filter(e => e.email.toLowerCase() !== email.toLowerCase());
}
