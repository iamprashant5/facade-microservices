import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {CONTENT_TYPE, STATUS_CODE} from '@sourceloop/core';
import {authenticate, STRATEGY} from 'loopback4-authentication';
import {authorize} from 'loopback4-authorization';
import {PermissionKey} from '../enums/permission.enum';
import {Todo} from '../models';
import {TodoRepository} from '../repositories';

const base = '/to-dos';
export class ToDoController {
  constructor(
    @repository(TodoRepository)
    public toDoRepository: TodoRepository,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.CreateTodo]})
  @post(base, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Todo model instance',
        content: {[CONTENT_TYPE.JSON]: {schema: getModelSchemaRef(Todo)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Todo, {
            title: 'NewToDo',
            exclude: ['id'],
          }),
        },
      },
    })
    toDo: Omit<Todo, 'id'>,
  ): Promise<Todo> {
    return this.toDoRepository.create(toDo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get('/to-dos/count', {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Todo model count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async count(@param.where(Todo) where?: Where<Todo>): Promise<Count> {
    return this.toDoRepository.count(where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(base, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Array of Todo model instances',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Todo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Todo) filter?: Filter<Todo>): Promise<Todo[]> {
    return this.toDoRepository.find(filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @patch(base, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Todo PATCH success count',
        content: {[CONTENT_TYPE.JSON]: {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    toDo: Todo,
    @param.where(Todo) where?: Where<Todo>,
  ): Promise<Count> {
    return this.toDoRepository.updateAll(toDo, where);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: ['*']})
  @get(`${base}/{id}`, {
    responses: {
      [STATUS_CODE.OK]: {
        description: 'Todo model instance',
        content: {
          [CONTENT_TYPE.JSON]: {
            schema: getModelSchemaRef(Todo, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Todo, {exclude: 'where'}) filter?: FilterExcludingWhere<Todo>,
  ): Promise<Todo> {
    return this.toDoRepository.findById(Number(id), filter);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @patch(`${base}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Todo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        [CONTENT_TYPE.JSON]: {
          schema: getModelSchemaRef(Todo, {partial: true}),
        },
      },
    })
    toDo: Todo,
  ): Promise<void> {
    await this.toDoRepository.updateById(Number(id), toDo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.UpdateTodo]})
  @put(`${base}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Todo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() toDo: Todo,
  ): Promise<void> {
    await this.toDoRepository.replaceById(Number(id), toDo);
  }

  @authenticate(STRATEGY.BEARER)
  @authorize({permissions: [PermissionKey.DeleteTodo]})
  @del(`${base}/{id}`, {
    responses: {
      [STATUS_CODE.NO_CONTENT]: {
        description: 'Todo DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.toDoRepository.deleteById(Number(id));
  }
}
