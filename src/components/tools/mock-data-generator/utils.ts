import { faker } from '@faker-js/faker/locale/en'

import type { MockField } from './schema-builder'

export function generateRecords(fields: MockField[], count: number): Record<string, unknown>[] {
	faker.seed(Math.floor(Math.random() * 10000))

	return Array.from({ length: count }, () => {
		const record: Record<string, unknown> = {}
		for (const field of fields) {
			if (!field.name.trim()) continue
			switch (field.type) {
				case 'uuid':
					record[field.name] = faker.string.uuid()
					break
				case 'number':
					record[field.name] = faker.number.int({ min: 10, max: 10000 })
					break
				case 'boolean':
					record[field.name] = faker.datatype.boolean()
					break
				case 'date':
					record[field.name] = faker.date.recent().toISOString()
					break
				case 'name':
					record[field.name] = faker.person.fullName()
					break
				case 'firstName':
					record[field.name] = faker.person.firstName()
					break
				case 'lastName':
					record[field.name] = faker.person.lastName()
					break
				case 'avatar':
					record[field.name] = faker.image.avatar()
					break
				case 'job':
					record[field.name] = faker.person.jobTitle()
					break
				case 'email':
					record[field.name] = faker.internet.email()
					break
				case 'phone':
					record[field.name] = faker.phone.number()
					break
				case 'website':
					record[field.name] = faker.internet.url()
					break
				case 'address':
					record[field.name] = faker.location.streetAddress()
					break
				case 'company':
					record[field.name] = faker.company.name()
					break
				case 'lorem':
					record[field.name] = faker.lorem.paragraph(1)
					break
				case 'sentence':
					record[field.name] = faker.lorem.sentence()
					break
				case 'word':
					record[field.name] = faker.lorem.word()
					break
				case 'amount':
					record[field.name] = faker.finance.amount()
					break
				case 'currency':
					record[field.name] = faker.finance.currencyCode()
					break
				case 'image':
					record[field.name] = faker.image.url()
					break
				case 'color':
					record[field.name] = faker.color.human()
					break
				default:
					record[field.name] = null
			}
		}
		return record
	})
}
