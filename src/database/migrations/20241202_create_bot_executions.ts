import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('bot_executions', (table) => {
    table.increments('id').primary();
    table.integer('bot_id').notNullable();
    table.string('bot_name').notNullable();
    table.enum('status', ['RUNNING', 'COMPLETED', 'FAILED']).notNullable().defaultTo('RUNNING');
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('finished_at').nullable();
    table.text('error_message').nullable();
    table.jsonb('metadata').nullable();
    table.timestamps(true, true); // created_at, updated_at
    
    // Índices para consultas frequentes
    table.index('bot_id');
    table.index('status');
    table.index('started_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists('bot_executions');
}

