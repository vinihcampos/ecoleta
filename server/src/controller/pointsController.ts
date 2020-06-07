import { Request, Response } from 'express';
import knex from '../database/connection';


class PointsController {
    async create (request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            city,
            uf,
            latitude,
            longitude,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        
        const point = {
            image: request.file.filename, 
            name,
            email, 
            whatsapp, 
            city,
            uf, 
            latitude, 
            longitude
        };

        const inserted_point = await trx('points').insert(point);
    
        const point_id = inserted_point[0];
        
        const pointItems = items
            .split(',')
            .map((item_id: string) => {
                return { 
                    item_id: Number(item_id.trim()), 
                    point_id 
                };
            });
    
        await trx('point_items').insert(pointItems);
        
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;
        const point = await knex('points').where('id', id).first();
        
        if(!point) 
            return response.status(404).json({message:'Point not found!'});
        
        const items = await knex('items').select('title')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id);

        const serializedPoint = {
            ...point,
            image_url: `/uploads/${point.image}`,
        }

        return response.json({ point: serializedPoint, items });
    }

    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .select('points.*')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .modify(query => {
                if(parsedItems !== undefined) query.whereIn('point_items.item_id', parsedItems );
                if(city !== undefined) query.where('city', 'ilike', String(city));
                if(uf !== undefined) query.where('uf', 'ilike', String(uf));
            })
            .distinct();
        
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `/uploads/${point.image}`,
            };
        });

        return response.json(serializedPoints);
    }
}

export default PointsController;