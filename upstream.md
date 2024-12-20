# Updating Your `develop` Branch with Changes from the Original Repository

- (Original Repo)[https://github.com/mivaecommerce/shadows]

## Steps to Update Your Custom Branch

1. **Switch to the main branch of your fork (`main`)**:
   ```bash
   git checkout main
   ```

2. **Fetch changes from the original repository**:
   ```bash
   git fetch upstream
   ```

3. **Merge changes from the original repository into your main branch**:
   ```bash
   git merge upstream/main
   ```

4. **Switch back to your branch with changes (`develop`)**:
   ```bash
   git checkout develop
   ```

5. **Merge changes from the main branch into your branch**:
   ```bash
   git merge main
   ```

6. **Push your updated branch to GitHub**:
   ```bash
   git push origin develop
   ```

By following these steps, you can keep your `develop` branch up-to-date with changes from the original repository while continuing to work on your custom modifications.
