import {
  baseUrl,
} from '../../rest-api/config';
import {
  IUpdateDataParams, ICreateDataParams, ICar, IDriveStatus, IGetCars, IGetWinners,
} from '../../types/interface';

export default class ApiClass {
  async getCars(path: string, page: string, limit:string): Promise<IGetCars> {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }
    let queryParams = '';

    if (page && limit) {
      queryParams = `_page=${page}&_limit=${limit}`;
    }
    const finishUrl = new URL(`${path}?${queryParams}`).toString();

    try {
      const response = await fetch(finishUrl);
      const data = await response.json();
      const totalCount = response.headers.get('X-Total-Count');

      const obj: IGetCars = {
        data,
        count: (!totalCount) ? data.length : String(response.headers.get('X-Total-Count')),
      };
      return obj;
    } catch (er) {
      throw new Error();
    }
  }

  async getWinners(path: string, page: string, limit:string): Promise<IGetWinners> {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }
    let queryParams = '';

    if (path.includes('?')) {
      queryParams = '&';
    } else {
      queryParams = '?';
    }

    if (page && limit) {
      queryParams = `${queryParams}_page=${page}&_limit=${limit}`;
    }
    const finishUrl = new URL(`${path}${queryParams}`).toString();
    try {
      const response = await fetch(finishUrl);
      const data = await response.json();
      const totalCount = response.headers.get('X-Total-Count');

      const obj: IGetWinners = {
        data,
        count: (!totalCount) ? data.length : String(response.headers.get('X-Total-Count')),
      };

      return obj;
    } catch (er) {
      throw new Error();
    }
  }

  async getItemCar(path: string): Promise<ICar> {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }
    const finishUrl = new URL(`${path}`).toString();

    try {
      const response = await fetch(finishUrl);
      const data = await response.json();
      return data;
    } catch (er) {
      throw new Error();
    }
  }

  async post(path: string, body: ICreateDataParams) {
    if (!path || !body) {
      throw new Error('Не указан параметр!');
    }

    const finishUrl = new URL(`${path}`, `${baseUrl}`).toString();

    const options: RequestInit = {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(finishUrl, options);
      const data = await response.json();
      return data;
    } catch (er) {
      throw new Error();
    }
  }

  async put(path: string, body: IUpdateDataParams) {
    if (!path || !body) {
      throw new Error('Не указан параметр!');
    }

    const finishUrl = new URL(`${path}`, `${baseUrl}`).toString();

    const options: RequestInit = {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(finishUrl, options);
      const data = await response.json();
      return data;
    } catch (er) {
      throw new Error();
    }
  }

  async delete(path: string) {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }

    const finishUrl = new URL(`${path}`, `${baseUrl}`).toString();

    const options: RequestInit = {
      method: 'DELETE',
    };

    try {
      const response = await fetch(finishUrl, options);
      const data = await response.json();
      return data;
    } catch (er) {
      throw new Error();
    }
  }

  async engine(path: string) {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }

    const finishUrl = new URL(`${path}`).toString();

    const options: RequestInit = {
      method: 'PATCH',
    };

    try {
      const response = await fetch(finishUrl, options);
      const data = await response.json();
      return data;
    } catch (er) {
      throw new Error();
    }
  }

  async drive(path: string) {
    if (!arguments.length) {
      throw new Error('Не указан параметр!');
    }

    const finishUrl = new URL(`${path}`).toString();

    const options: RequestInit = {
      method: 'PATCH',
    };
    const response = await fetch(finishUrl, options).catch();

    if (response.status !== 200) {
      const data: IDriveStatus = {
        success: false, /* ,
                   errors: true */
      };
      return data;
    }
    const data = await response.json();
    return data;
  }
}
