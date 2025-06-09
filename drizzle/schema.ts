import { relations } from 'drizzle-orm'
import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
} from 'drizzle-orm/pg-core'

export const userRoles = ['admin', 'expert'] as const
export type UserRole = (typeof userRoles)[number]
export const userRoleEnum = pgEnum('user_roles', userRoles)

export const UserTable = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text(),
  salt: text(),
  role: userRoleEnum().notNull().default('admin'),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const userRelations = relations(
  UserTable,
  ({ many }: { many: any }) => ({
    customers: many(CustomerTable),
    projects: many(ProjectTable),
  })
)

export const CustomerTable = pgTable('customers', {
  id: uuid().primaryKey().defaultRandom(),
  createdBy: uuid()
    .notNull()
    .references(() => UserTable.id),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull().unique(),
  phoneNumber: text(),
  address: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const customerRelations = relations(
  CustomerTable,
  ({ one, many }: { one: any; many: any }) => ({
    creator: one(UserTable, {
      fields: [CustomerTable.createdBy],
      references: [UserTable.id],
    }),
    projects: many(ProjectTable),
  })
)

export const ExpertTable = pgTable('experts', {
  id: uuid().primaryKey().defaultRandom(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  email: text().notNull().unique(),
  phoneNumber: text(),
  status: text().notNull().default('pending'), // pending, active, inactive
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const expertRelations = relations(
  ExpertTable,
  ({ many }: { one: any; many: any }) => ({
    projects: many(ProjectTable),
  })
)

export const ProjectTable = pgTable('projects', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  address: text().notNull(),
  createdBy: uuid()
    .notNull()
    .references(() => UserTable.id),
  customerId: uuid()
    .notNull()
    .references(() => CustomerTable.id),
  expertId: uuid()
    .notNull()
    .references(() => ExpertTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const projectRelations = relations(
  ProjectTable,
  ({ one, many }: { one: any; many: any }) => ({
    creator: one(UserTable, {
      fields: [ProjectTable.createdBy],
      references: [UserTable.id],
    }),
    customer: one(CustomerTable, {
      fields: [ProjectTable.customerId],
      references: [CustomerTable.id],
    }),
    expert: one(ExpertTable, {
      fields: [ProjectTable.expertId],
      references: [ExpertTable.id],
    }),
    buildings: many(BuildingTable),
  })
)

export const BuildingTable = pgTable('buildings', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  constructionType: text().notNull(),
  numberOfFloors: integer().notNull(),
  numberOfUnits: integer().notNull(),
  projectId: uuid()
    .notNull()
    .references(() => ProjectTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const buildingRelations = relations(
  BuildingTable,
  ({ one, many }: { one: any; many: any }) => ({
    project: one(ProjectTable, {
      fields: [BuildingTable.projectId],
      references: [ProjectTable.id],
    }),
    eees: many(EeeTable),
  })
)

export const EeeTable = pgTable('eees', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  floor: integer('floor').notNull(),
  unit: text('unit').notNull(),
  buildingId: uuid('building_id')
    .notNull()
    .references(() => BuildingTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const eeeRelations = relations(EeeTable, ({ one }: { one: any }) => ({
  building: one(BuildingTable, {
    fields: [EeeTable.buildingId],
    references: [BuildingTable.id],
  }),
}))
