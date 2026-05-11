import React, { useState } from "react";
import { 
  FlatList,
  Image,
  StyleSheet, 
  Text, 
  View, 
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SPACING } from "../../src/constants/theme";
import SearchBar from "../../src/components/recipe/SearchBar";
import RecipeCard from "../../src/components/recipe/RecipeCard";
import { Recipe } from "../../src/types";
import recipesData from "../../src/data/recipes.json";
import CategoryBar from "../../src/components/recipe/CategoryBar";
import { Ionicons } from "@expo/vector-icons";

const recipes = recipesData as Recipe[];

const CATEGORIES = [
  "All",
  "Breakfast",
  "Snacks",
  "Main Course",
  "Desserts",
  "Italian",
  "Mexican",
  "Chinese",
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRecipes = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryTerms = query.split(/\s+/).filter(term => term.length > 0);

    return recipes.filter((recipe) => {
      const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
      if (!matchesCategory) return false;

      if (queryTerms.length === 0) return true;

      const title = recipe.title.toLowerCase();
      const category = recipe.category.toLowerCase();
      
      // Check if all search terms appear in the title or category
      return queryTerms.every(term => title.includes(term) || category.includes(term));
    });
  }, [searchQuery, selectedCategory]);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.logoContainer}>
            <Image 
              source={require("../../assets/images/LOGO1.png")} 
              style={styles.logoImage} 
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerRight} />
        </View>
        
        <Text style={styles.greeting}>Discover Your Next</Text>
        <Text style={styles.subGreeting}>Favorite Recipe</Text>
      </View>

      {/* Search Bar */}
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

      {/* Categories Bar */}
      <CategoryBar 
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={50} color={COLORS.textLight} style={{ opacity: 0.3 }} />
      <Text style={styles.emptyText}>No recipes found in this category.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <RecipeCard recipe={item} index={index} />
        )}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={6}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={true}
        ListFooterComponent={<View style={styles.footerSpacer} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingTop: SPACING.m,
  },
  headerContent: {
    marginBottom: SPACING.m,
  },
  columnWrapper: {
    paddingHorizontal: SPACING.m,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: SPACING.m,
  },
  headerTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  logoContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    height: 40,
  },
  logoImage: {
    width: 120,
    height: 40,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.text,
  },
  subGreeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.m,
  },
  footerSpacer: {
    height: 80, // Space for tab bar
  },
  emptyContainer: {
    flex: 1,
    paddingVertical: SPACING.xl * 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  emptyText: {
    marginTop: SPACING.m,
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "600",
  }
});
