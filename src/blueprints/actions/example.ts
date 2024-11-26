import { ActionFunction, PipelineContext, TableEntryContent } from 'types';

export const createTodo: ActionFunction = async (context: PipelineContext): Promise<any> => {
    context.printer.display('Executando...', { name: 'dots3' });

    // // Definindo colunas com mais diversidade
    // const columns = [
    //     { key: 'name', header: 'Name' },
    //     { key: 'age', header: 'Age' },
    //     { key: 'email', header: 'Email' },
    //     { key: 'city', header: 'City' },
    //     { key: 'job', header: 'Job' },
    //     { key: 'hobby', header: 'Hobby' },
    // ];

    // // Listas de nomes, cidades, empregos e hobbies
    // const firstNames = [
    //     'Alice',
    //     'Bob',
    //     'Charlie',
    //     'Diana',
    //     'Eve',
    //     'Frank',
    //     'Grace',
    //     'Hannah',
    //     'Isaac',
    //     'Julia',
    // ];
    // const lastNames = [
    //     'Smith',
    //     'Johnson',
    //     'Brown',
    //     'Taylor',
    //     'Anderson',
    //     'Thomas',
    //     'Jackson',
    //     'White',
    //     'Harris',
    //     'Martin',
    // ];
    // const cities = [
    //     'New York',
    //     'Berlin',
    //     'Tokyo',
    //     'São Paulo',
    //     'Paris',
    //     'London',
    //     'Madrid',
    //     'Rome',
    //     'Dubai',
    //     'Sydney',
    // ];
    // const jobs = [
    //     'Developer',
    //     'Designer',
    //     'Manager',
    //     'Engineer',
    //     'Analyst',
    //     'Teacher',
    //     'Doctor',
    //     'Nurse',
    //     'Artist',
    //     'Writer',
    // ];
    // const hobbies = [
    //     'Cycling',
    //     'Painting',
    //     'Reading',
    //     'Gaming',
    //     'Cooking',
    //     'Hiking',
    //     'Dancing',
    //     'Swimming',
    //     'Gardening',
    //     'Fishing',
    // ];

    // // Gerar várias linhas com valores reais variados
    // const data = Array.from({ length: 10 }, () => {
    //     const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    //     const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    //     const randomName = `${randomFirstName} ${randomLastName}`;
    //     const randomAge = Math.floor(Math.random() * 60) + 18; // Idades entre 18 e 77
    //     const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@example.com`;
    //     const randomCity = cities[Math.floor(Math.random() * cities.length)];
    //     const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    //     const randomHobby = hobbies[Math.floor(Math.random() * hobbies.length)];

    //     return {
    //         name: randomName,
    //         age: randomAge,
    //         email: randomEmail,
    //         city: randomCity,
    //         job: randomJob,
    //         hobby: randomHobby,
    //     };
    // });

    // const tableContent: TableContent = { columns, data };
    // context.printer.printTable(tableContent);

    // context.printer.downloadAsCsv('arquivo-teste.csv', tableContent);

    await new Promise((resolve) => setTimeout(resolve, 2000));
};
