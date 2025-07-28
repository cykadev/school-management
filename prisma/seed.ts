import prisma from "../lib/prisma";
import bcrypt from "bcryptjs";

// Helper to hash passwords
async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Clear all relevant tables
async function clearTables(): Promise<void> {
  try {
    await prisma.user.deleteMany({});
    await prisma.organizationModule.deleteMany({});
    await prisma.module.deleteMany({});
    await prisma.organization.deleteMany({});
    console.log('🧹 Cleared users, organizations, modules, and organizationModule data');
  } catch (error) {
    console.error('❌ Error clearing tables:', error);
    throw error;
  }
}

// Create organizations
async function createOrganizations(): Promise<any[]> {
  try {
    const organizations = await prisma.organization.createManyAndReturn({
      data: [
        { name: 'Tech Corp' },
        { name: 'InnovateX' },
        { name: 'DataWorks' },
        { name: 'CloudLabs' },
        { name: 'FutureAI' },
        { name: 'WebSolutions' },
        { name: 'DevStudio' },
        { name: 'CodeMasters' },
        { name: 'NextGen Tech' },
        { name: 'ByteBuilders' },
      ],
    });
    console.log(`🌱 Seeded ${organizations.length} organizations`);
    console.log('Organizations:', organizations.map(o => ({ id: o.id, name: o.name })));
    return organizations;
  } catch (error) {
    console.error('❌ Error creating organizations:', error);
    throw error;
  }
}

// Create users and link to organizations
async function createUsers(organizations: any[]): Promise<any[]> {
  try {
    if (organizations.length === 0) {
      throw new Error('No organizations available to assign users');
    }

    const users = [];
    for (let i = 0; i < 20; i++) {
      const orgIndex = i % organizations.length;
      const org = organizations[orgIndex];
      const hashedPassword = await hashPassword(`password${i + 1}`);

      console.log(`Creating user with email: user${i + 1}@example.com, organizationId: ${org.id}`);
      const user = await prisma.user.create({
        data: {
          firstName: `User${i + 1}`,
          lastName: `LastName${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: hashedPassword,
          role: i === 0 ? 'ADMIN' : 'USER',
          status: 'ACTIVE',
          organizationId: org.id,
        },
      });
      users.push(user);
    }
    console.log(`🌱 Seeded ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

// Create modules
async function createModules(): Promise<any[]> {
  try {
    const modules = await prisma.module.createManyAndReturn({
      data: [
        { name: 'Module 1', slug: 'module-1' },
        { name: 'Module 2', slug: 'module-2' },
        { name: 'Module 3', slug: 'module-3' },
        { name: 'Module 4', slug: 'module-4' },
        { name: 'Module 5', slug: 'module-5' },
        { name: 'Module 6', slug: 'module-6' },
        { name: 'Module 7', slug: 'module-7' },
        { name: 'Module 8', slug: 'module-8' },
        { name: 'Module 9', slug: 'module-9' },
        { name: 'Module 10', slug: 'module-10' },
      ],
    });
    console.log(`🌱 Seeded ${modules.length} modules`);
    return modules;
  } catch (error) {
    console.error('❌ Error creating modules:', error);
    throw error;
  }
}

// Link organizations to modules
async function linkOrganizationsToModules(organizations: any[], modules: any[]): Promise<void> {
  try {
    if (organizations.length === 0 || modules.length === 0) {
      console.warn('⚠️ No organizations or modules available to link');
      return;
    }

    const organizationModuleData = [];
    for (const org of organizations) {
      const selectedModules = modules
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * modules.length) + 1);

      for (const mod of selectedModules) {
        organizationModuleData.push({
          organizationId: org.id,
          moduleId: mod.id,
        });
      }
    }

    await prisma.organizationModule.createMany({
      data: organizationModuleData,
    });
    console.log(`🔗 Linked ${organizationModuleData.length} organization-module pairs`);
  } catch (error) {
    console.error('❌ Error linking organizations to modules:', error);
    throw error;
  }
}

// Main seeding function
async function seed(): Promise<void> {
  try {
    await clearTables();
    const organizations = await createOrganizations();
    await createUsers(organizations);
    const modules = await createModules();
    await linkOrganizationsToModules(organizations, modules);
    console.log('✅ Seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();