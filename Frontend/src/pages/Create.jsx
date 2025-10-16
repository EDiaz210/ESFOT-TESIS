import { Form } from '../components/create/Form'

const Create = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-white pt-15'>Crear</h1>
            <hr className='my-4 border-t-2 border-white' />
            <p className='mb-8 text-white'>Este módulo te permite gestionar pasantes</p>
            <Form />
        </div>
    )
}

export default Create